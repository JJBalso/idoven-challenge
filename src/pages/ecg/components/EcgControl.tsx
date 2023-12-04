import { useContext, useRef, useState, useEffect } from "react";
import { SelectChangeEvent, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { EcgContext } from "../ecg-context";
import { EcgData, EcgControls } from "../interfaces/ecg.interface";
import EcgChart from "./EcgChart";
import './EcgControl.css';

export default function EcgControl() {
    // All data from context
    const ecgData = useContext(EcgContext);

    // Data Ref to store data without trigger render
    const dataRef = useRef<EcgData[][]>([]);

    // State of the control
    const [controls, setControls] = useState<EcgControls>({count: 0, range: 1000, hasStarted: false});

    // Data to be represented
    const [chartData, setChartData] = useState<EcgData[]>([]);

    // Store data but not trigger render
    useEffect(() => {
        dataRef.current = ecgData;
    }, [ecgData])

    // Calculate data to be displayed
    useEffect(() => {
        const data = dataRef.current;
        let groupedData: EcgData[] = [];

        const initialItem = controls.count*controls.range;
        let skipCount = 0;
        let startChunkIndex = 0;

        // Count items
        data.some((d, i) => {
            if (d.length > initialItem - skipCount) {
                startChunkIndex = i;
                return true
            } else {
                skipCount += d.length;
            }
        });

        for (let i = startChunkIndex; i < data.length; i++) {
            if (i === startChunkIndex) {
                const dataLenghtDif = data[i].length - (initialItem - skipCount)

                if (dataLenghtDif > controls.range) {
                    groupedData = data[i].slice(initialItem - skipCount, initialItem - skipCount + controls.range);
                    break;
                } else {
                    groupedData = data[i].slice(initialItem - skipCount, data[i].length);
                }

            } else {
                const dataRangeDif = controls.range - groupedData.length;

                if (dataRangeDif > data[i].length){
                    groupedData = [...groupedData, ...data[i]];
                } else {
                    const remaining = data[i].slice(0, dataRangeDif);
                    groupedData = [...groupedData, ...remaining];
                    break;
                }
            }
        }

        // handle when push this data
        setChartData(groupedData);
        console.log('created data', groupedData);
        
    }, [controls]);

    // go a step back
    const back = () => {        
        const count = controls.count - 1;

        if (count >= 0) {
            setControls({
                ...controls,
                count,
            })
        }
    }

    // go a step forward
    const next = () => {        
        const total = dataRef.current.reduce((total, d) => total + d.length, 0);
        const count = controls.count + 1;

        if (total - count*controls.range > controls.range ) {
            setControls({
                ...controls,
                count,
            })
        }
    }

    // start showing data
    const start = () => {
        if (!controls.hasStarted ) {
            setControls({
                ...controls,
                hasStarted: true,
            })
        }
    }

    // change range
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
                Electrocardiogram
            </Typography>
            <div className="Ecg-chart">
                <EcgChart data={chartData}></EcgChart>
                {!controls.hasStarted && <div className="Ecg-display">
                    <Button                
                        variant="contained" 
                        size="large"
                        onClick={start}
                    >
                        Start showng data!
                    </Button>
                </div>}
            </div>
            <div className="Ecg-controls">
                <IconButton
                    aria-label="back"
                    size="large"
                    disabled={!controls.hasStarted}
                    onClick={back}
                >
                    <ArrowBackIcon />
                </IconButton>
                <FormControl fullWidth>
                    <InputLabel>Range</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={controls.range.toString()}
                        label="Age"
                        disabled={!controls.hasStarted}
                        onChange={handleRange}
                    >
                    {/* TODO: store it in variable */}
                    <MenuItem value={1000}>1000 datapoints</MenuItem>
                    <MenuItem value={5000}>5000 datapoints</MenuItem>
                    <MenuItem value={10000}>10000 datapoints</MenuItem>
                    </Select>
                </FormControl>
                <IconButton 
                    aria-label="next"
                    size="large"
                    disabled={!controls.hasStarted}
                    onClick={next}
                >
                    <ArrowForwardIcon />
                </IconButton>
            </div>
        </>       
    );
}