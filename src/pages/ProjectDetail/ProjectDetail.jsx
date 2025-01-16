import * as React from "react";
import ProjectSummary from "./ProjectSummary/ProjectSummary";
import BudgetDistribution from "./ExpenseDistribution/BudgetDistribution";
import { Row, Col } from "antd";
import TransactionList from "./ExpenseList/expenseList";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { projectId } = useParams();

  const projectID = React.useMemo(() => projectId, [projectId]);

  return (
    <>
      <Row className="w-full mb-4" gutter={[16, 16]}>
        <ProjectSummary projectId={projectID}/>
      </Row>
      <Row className="w-full mb-4" gutter={[16, 16]}>
        <BudgetDistribution projectId={projectId} />
      </Row>
      <Row className="w-full h-full mb-4" gutter={[16, 16]}>
        <TransactionList projectId={projectId} />
      </Row>
    </>
  );
};

export default React.memo(ProjectDetails);
