import dynamic from "next/dynamic";
import { SurveyData } from "../types";

interface SurveyComponentProps {
  data: SurveyData;
  socket: any;
  surveyVisible: boolean;
}

const SurveyComponent: React.FC<SurveyComponentProps> = ({
  data,
  socket,
  surveyVisible = true,
}) => {
  let Survey;
  switch (data.id) {
    case 0:
      Survey = dynamic(() => import("./Survey0"));
      break;
    case 1:
      Survey = dynamic(() => import("./Survey1"));
      break;
    case 2:
      Survey = dynamic(() => import("./Survey2"));
      break;
    case 3:
      Survey = dynamic(() => import("./Survey3"));
      break;
    case 4:
      Survey = dynamic(() => import("./Survey4"));
      break;
    case 5:
      Survey = dynamic(() => import("./Survey5"));
      break;
    case 6:
      Survey = dynamic(() => import("./Survey6"));
      break;
    case 7:
      Survey = dynamic(() => import("./Survey7"));
      break;
    default:
      return <div>Unknown Survey</div>;
  }

  return <Survey data={data} socket={socket} visible={surveyVisible} />;
};

export default SurveyComponent;
