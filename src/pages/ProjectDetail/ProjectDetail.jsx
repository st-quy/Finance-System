import * as React from "react";
import ProjectSummary from "./ProjectSummary";
import BudgetDistribution from "./ExpenseDistribution/BudgetDistribution";
import { Row, Col } from "antd";
import TransactionList from "./TransactionList/TransactionList";
import { useParams } from 'react-router-dom';


const ProjectDetails = () => {
    const { project_id } = useParams();

    const projectId = React.useMemo(() => project_id, [project_id]);


    return (
        <>
            <Row className="w-full mb-4" gutter={[16, 16]}>
                <ProjectSummary projectId={projectId} />
            </Row>
            <Row className="w-full mb-4" gutter={[16, 16]}>
                <BudgetDistribution projectId={project_id}/>
            </Row>
            <Row className="w-full h-full mb-4" gutter={[16, 16]}>
                <TransactionList projectId={project_id}/>
            </Row>
        </>

    );
}

export default React.memo(ProjectDetails);