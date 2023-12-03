import { useContext, useEffect, useState } from 'react';
import { EcgData, EcgControl } from './interfaces/ecg.interface';
import EcgChart from './components/EcgChart';
import { EcgContext } from './ecg-context';
import './Ecg.css';
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function EcgControls() {
    const data = useContext(EcgContext);
    const [controls, setControls] = useState<EcgControl>({count: 0, range: 5000});

    // Use always 2 chunks
    // One first is not available, 
    const [lines, setLines] = useState<EcgData[]>([]);

    useEffect(() => {
        let chartData: EcgData[] = [];

        const initialItem = controls.count*controls.range;
        let skipCount = 0;

        let startIndex = 0;

        // Count items
        data.some((d, i) => {
            if (d.length > initialItem - skipCount) {
                startIndex = i;
                return true
            } else {
                skipCount = d.length;
            }
        });

        for (let i = startIndex; i < data.length; i++) {
            if (i === startIndex) {
                const dif = data[i].length - (initialItem - skipCount)

                if (dif > controls.range) {
                    chartData = data[i].slice(initialItem - skipCount, initialItem - skipCount + controls.range);
                    break;
                } else {
                    chartData = data[i].slice(initialItem - skipCount, data[i].length);
                }

            } else {
                const dif = controls.range - chartData.length;

                if (data[i].length < dif){
                    chartData = [...chartData, ...data[i]];
                } else {
                    const remaining = data[i].slice(0, dif);
                    chartData = [...chartData, ...remaining];
                    break;
                }
            }
        }

        // handle when push this data
        setLines(chartData);

        // handle lenght of the data
        // if (data[0]) {
        //     //
        //     const nextLines = data[0].filter((t, index) => index > controls.start && index < (controls.start + controls.limit));

        //     setLines(nextLines);
        // }
        
    }, [data, controls]);

    const back = () => {
        // back 10k data
        const count = controls.count - 1;

        if (count >= 0) {
            setControls({
                ...controls,
                count,
            })
        }
    }

    const next = () => {
        // next 10k data
        const total = data.reduce((total, d) => total + d.length, 0);
        const count = controls.count + 1;

        if (total - count*controls.range > controls.range ) {
            setControls({
                ...controls,
                count,
            })
        }
    }

    const handleRange = (event: SelectChangeEvent) => {
        const range = Number(event.target.value);

        setControls({
            ...controls,
            range,
        })
    }

    return (
        <>
            <Typography variant="h2" component="h2" className="Ecg-title">
                ECG from time {lines[0]?.time}
            </Typography>
            <div className="Ecg-chart">
                <EcgChart data={lines}></EcgChart>
            </div>
            <div className="Ecg-controls">
                <IconButton aria-label="delete" size="large" onClick={back}>
                    <ArrowBackIcon />
                </IconButton>
                <FormControl fullWidth>
                    <InputLabel>Range</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={controls.range.toString()}
                        label="Age"
                        onChange={handleRange}
                    >
                    <MenuItem value={1000}>1000</MenuItem>
                    <MenuItem value={5000}>5000</MenuItem>
                    <MenuItem value={10000}>10000</MenuItem>
                    </Select>
                </FormControl>
                <IconButton aria-label="delete" size="large" onClick={next}>
                    <ArrowForwardIcon />
                </IconButton>
            </div>
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

                    return;
                }
    
                const lines = new TextDecoder().decode(value).split('\n');
                const data: EcgData[] = [];

                // solve time cuts

                lines.forEach((line) => {
                    const timePos = line.split(',');

                    // Only push data if it's a complete line of data
                    // TODO: handle incomplete lines
                    // TODO: solve cuts
                    if (timePos.length === 6) {
                        data.push({
                            time: Number(timePos[0]),
                            value: Number(timePos[1])
                        });
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
        // Push from 100 to 100 maybe?
        // TODO
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