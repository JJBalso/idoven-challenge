import { useContext, useEffect, useState } from 'react';
import { EcgData, EcgControl } from './interfaces/ecg.interface';
import EcgChart from './components/EcgChart';
import { EcgContext } from './ecg-context';

function EcgControls() {
    const data = useContext(EcgContext);
    const [controls, setControls] = useState<EcgControl>({start: 0, limit: 10000, step: 250});

    // Use always 2 chunks
    // One first is not available, 
    const [lines, setLines] = useState<EcgData[]>([]);

    useEffect(() => {

        // handle lenght of the data
        if (data[0]) {
            //
            const nextLines = data[0].filter((t, index) => index > controls.start && index < (controls.start + controls.limit));

            setLines(nextLines);
        }
        
    }, [data, controls]);

    const back = () => {
        const start = controls.start - controls.step;

        if (start > 0) {
            setControls({
                ...controls,
                start,
            })
        }
    }

    const next = () => {
        const start = controls.start + controls.step;

        if ((start + controls.limit) < data[0].length ) {
            setControls({
                ...controls,
                start,
            })
        }
    }

    return (
        <>
            <EcgChart data={lines}></EcgChart>
            {/* <EcgChart data={lines}></EcgChart> */}
            <div onClick={back}>BACK</div>
            <div onClick={next}>NEXT</div>
        </>       
    );
}


function Ecg() {
    // All data pushed in real time
    const [data, setData] = useState<EcgData[][]>([]);


    const [chartData, setChartData] = useState<EcgData[][]>([]);

    const startDate = new Date();

    // When initialized
    useEffect(() => {
        fetch('data/sample.txt')
        .then(response => response.body)
        .then((body) => {
            const reader = body?.getReader();

            reader?.read().then(function pump({ done, value }): any {
                if (done) {
                    // Get loading time
                    const loadingTime = new Date().getTime() - startDate.getTime() 

                    console.log(loadingTime);
                    window.alert(loadingTime);

                    return;
                }
    
                const lines = new TextDecoder().decode(value).split('\n');
                const data: EcgData[] = [];

                lines.forEach((line) => {
                    const timePos = line.split(',');

                    // Only push data if it's a complete line of data
                    // TODO: handle incomplete lines
                    if (timePos.length === 6) {
                        data.push({
                            time: Number(timePos[0]),
                            value: Number(timePos[1])
                        })                        
                    }
                })

                // Accumulate in chunks
                setData((curr) => [...curr, data]);

                // Read some more, and call this function again
                return reader.read().then(pump);
            });            
        })
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if(data.length > 1 && data.length < 10) {
            setChartData(data);
        }
    }, [data]);

    useEffect(() => {
        console.log('chartData')
    }, [chartData]);

    return (
        <EcgContext.Provider value={chartData}>
            <EcgControls></EcgControls>
        </EcgContext.Provider>
    );
  }
  
export default Ecg;