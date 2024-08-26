import CircularProgress from '@mui/material/CircularProgress';
import Pane from '../../Pane/Pane';

type FinalistsPaneProps = {
    isLoading: boolean;
}

const FinalistsPane: React.FC<FinalistsPaneProps> = (props) => {

    return props.isLoading ? (
        <Pane>
            <p>Loading finalist information...</p>
            <CircularProgress />
        </Pane>
    )
    : (
        <Pane>
            Finalists Panel
        </Pane>
    );
}

export default FinalistsPane;
