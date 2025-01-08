import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import RadialBarChart from "./Components/RadialBarChart";
import IncomeExpensesChart from "./Components/IncomeAndExpensesChart";
import { Col, Row } from "antd";

const Overview = () => {
  const [data, setData] = useState(null);
  const supabaseUrl = "https://dilsljuynpaogrrxqolf.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbHNsanV5bnBhb2dycnhxb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMTc0MDAsImV4cCI6MjA1MTc5MzQwMH0.4hvawiI87VmdXSXYlxKnYp7nkn7emE4rn6Y3hWTE4LU";
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
