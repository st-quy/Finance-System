import * as React from "react";
import ProjectSummary from "./ProjectSummary";
import BudgetDistribution from "./ExpenseDistribution/BudgetDistribution";
import { Row, Col } from "antd";
import ProjectFilter from "./ProjectFilter/ProjectFilter";
import TransactionList from "./TransactionList/TransactionList";

const ProjectDetails = () => {

    return (
        <>
            <Row className="w-full mb-4" gutter={[16, 16]}>
                <ProjectSummary />
            </Row>
            <Row className="w-full mb-4" gutter={[16, 16]}>
                <BudgetDistribution />
            </Row>
            <Row className="w-full mb-4" gutter={[16, 16]}>
                <ProjectFilter />
            </Row>
            <Row className="w-full h-full mb-4" gutter={[16, 16]}>
                <TransactionList />
            </Row>
        </>

    );
}

export default ProjectDetails;