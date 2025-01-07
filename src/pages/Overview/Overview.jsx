import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import RadialBarChart from "./Components/RadialBarChart";
import IncomeExpensesChart from "./Components/IncomeAndExpensesChart";
import { Col, Row } from "antd";

const Overview = () => {
  const [data, setData] = useState(null);
  const supabaseUrl = "https://tfbppkbfoaiukgaowgnt.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYnBwa2Jmb2FpdWtnYW93Z250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MTEzMjcsImV4cCI6MjA1MTM4NzMyN30.oD9Nx9XXQtLAHM4ERxcHYaVjLdrESFKFCdLNlXrInnY";
  const supabase = createClient(supabaseUrl, supabaseKey);

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
