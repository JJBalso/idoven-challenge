import { useEffect, useState } from 'react';
import { EcgData } from './interfaces/ecg.interface';
import { EcgContext } from './ecg-context';
import './Ecg.css';
import EcgControl from './components/EcgControl';

function Ecg() {
    const [chartData, setChartData] = useState<EcgData[][]>([]);

    const startDate = new Date();

    // When initialized
    useEffect(() => {
        fetch('data/sample.txt') // Replace this line with the url of the file
        .then(response => response.body)
        .then((body) => {
            const reader = body?.getReader();

            let previousTime = 0;

            reader?.read().then(function pump({ done, value }): any {
                if (done) {
                    // Get loading time
                    const loadingTime = new Date().getTime() - startDate.getTime() 

                    console.log(loadingTime);

                    return;
                }
    
                const lines = new TextDecoder().decode(value).split('\n');
                const data: EcgData[] = [];

                // solve time cuts
                if (!previousTime) {
                    const firstTime = Number(lines[0].split(',')[0])
                    previousTime = !Number.isNaN(firstTime) ? firstTime : 0;
                }

                lines.forEach((line) => {
                    const timePos = line.split(',');

                    // Only push data if it's a complete line of data
                    // Use time to discard incomplete lines
                    if (timePos.length === 6) {
                        const time = Number(timePos[0]);

                        if (Math.abs(time - previousTime) < 0.1) {
                            data.push({
                                time: Number(timePos[0]),
                                value: Number(timePos[1])
                            });

                            previousTime = time;
                        }
                    }                    
                })

                // Accumulate in chunks
                setChartData((curr) => [...curr, data]);

                // Read some more, and call this function again
                return reader.read().then(pump);
            });            
        })
        .catch(error => console.error(error));
    }, []);

    return (
        <EcgContext.Provider value={chartData}>
            <EcgControl></EcgControl>
        </EcgContext.Provider>
    );
  }
  
export default Ecg;