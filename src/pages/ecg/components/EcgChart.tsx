import { IgrCategoryChart, IgrCategoryChartModule } from "igniteui-react-charts";
import { EcgData } from "../interfaces/ecg.interface";

IgrCategoryChartModule.register();

function EcgChart({data}: {data: EcgData[]}) {
    return <IgrCategoryChart
        width="100%"
        height="100%"
        chartType="Line"
        dataSource={data}
        // includedProperties={["value"]}
        xAxisEnhancedIntervalPreferMoreCategoryLabels="false"
        shouldConsiderAutoRotationForInitialLabels="false"
        shouldAutoExpandMarginForInitialLabels="false"
        crosshairsDisplayMode="None"
        autoMarginAndAngleUpdateMode="None"
        markerTypes="None" />
}

export default EcgChart;