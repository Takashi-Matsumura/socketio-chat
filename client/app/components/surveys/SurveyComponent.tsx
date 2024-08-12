import dynamic from "next/dynamic";
import { SurveyData } from "../types";

interface SurveyComponentProps {
  data: SurveyData;
  socket: any;
}

const SurveyComponent: React.FC<SurveyComponentProps> = ({ data, socket }) => {
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
    // 他のケースも追加可能
    default:
      return <div>Unknown Survey</div>;
  }

  return <Survey data={data} socket={socket} />;
};

export default SurveyComponent;
