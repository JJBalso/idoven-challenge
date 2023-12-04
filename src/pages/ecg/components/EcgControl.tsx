import { SelectChangeEvent, Typography, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useContext, useRef, useState, useEffect } from "react";
import { EcgContext } from "../ecg-context";
import { EcgData, EcgControls } from "../interfaces/ecg.interface";
import EcgChart from "./EcgChart";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function EcgConditional({showChart, lines}: {showChart: boolean, lines: EcgData[]}) {
    if (showChart) {
        return <EcgChart data={lines}></EcgChart>
    }

    return <div>loading...</div>
}

export default function EcgControl() {
    // All data from context
    const chartData = useContext(EcgContext);

    // Data Ref to store data without trigger render
    const dataRef = useRef<EcgData[][]>([]);

    // State of the control
    const [controls, setControls] = useState<EcgControls>({count: 0, range: 1000, hasStarted: false});

    const [lines, setLines] = useState<EcgData[]>([]);

    // Store data but not trigger render
    useEffect(() => {
        dataRef.current = chartData;
    }, [chartData])

    // Calculate data to be displayed
    useEffect(() => {
        const data = dataRef.current;
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
                skipCount += d.length;
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
        
    }, [controls]);

    const back = () => {
        // go a step back
        const count = controls.count - 1;

        if (count >= 0) {
            setControls({
                ...controls,
                count,
            })
        }
    }

    const next = () => {
        // go a step forward
        const total = dataRef.current.reduce((total, d) => total + d.length, 0);
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

    const A = () => {
        if(controls.hasStarted) {
            return <EcgChart data={lines}></EcgChart>
        }
    
        return <div>loading...</div>
    }

    return (
        <>
            <Typography variant="h2" component="h2" className="Ecg-title">
                Electrocardiogram
            </Typography>
            <div className="Ecg-chart">
                <A/>                
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