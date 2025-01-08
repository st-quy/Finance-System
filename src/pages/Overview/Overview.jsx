import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import RadialBarChart from "./Components/RadialBarChart";
import IncomeExpensesChart from "./Components/IncomeAndExpensesChart";
import { Row, Col } from "antd";
import { supabase } from "../../supabaseClient";


const Overview = () => {

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.rpc("query", {
        query: `
          SELECT SUM(revenue_amount)
          FROM revenues
          WHERE EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
      });
      setData(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Row className="w-full" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={10} lg={10}>
          <RadialBarChart />
        </Col>
        <Col xs={24} sm={24} md={14} lg={14}>
          <IncomeExpensesChart />
        </Col>
      </Row>
    </div>
  );
};
export default Overview;
