import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import './Home.css';

function Home() {
    return (
        <div className="Home">
            <Typography variant="body1" component="div" paragraph>
                This is the landing page of the code challenge.
                You can access the challenge itself by clicking in the top-left menu and selecting "ecg".
            </Typography>
            <Typography variant="body1" component="div" paragraph>
                By default, the challenge loads a sample file located in the data folder (/public/data/sample.txt). This is only meant for a quick preview.
                If you want to display a large data file, like the one provided in the challenge instructions, please overwrite the current <i>sample.txt</i> file.
            </Typography>            
            <Typography variant="body1" component="div" paragraph>
                When you access the ecg route, the data will be fetched on load. You can start the chart view by clicking in the central button at any time.
                You may experience some performance issues until all data is loaded but you will be able to view data from the beginning.
                Use the arrows to navigate through the data and the range selector to pick the amount of points displayed.
            </Typography>
            <Typography variant="body1" component="div" paragraph>
                The chart is built with <i>igniteui-react-charts</i> that provides some built-in function like zoom-in/zoom-out with the mouse wheel 
                and area selection with left/right click.
            </Typography>
            <Typography variant="body1" component="div" paragraph>
                <Link to="/ecg">Go to challenge!</Link>
            </Typography>
        </div>
    );
}
  
export default Home;