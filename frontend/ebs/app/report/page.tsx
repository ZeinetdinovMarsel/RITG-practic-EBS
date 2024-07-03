"use client";
import { useEffect, useState } from "react";
import { message, Card, Row, Col, Statistic } from "antd";

interface Report {
  date: string;
  totalTasks: number;
  newTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
  overdueTasks: number;
  averageCompletionTime: number;
}

export default function TasksPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch("http://localhost:5183/report", {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Report = await response.json();
        setReport(data);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  return (
    <div>
         <div style={{ textAlign: 'center' }}>
      <h1>Отчёт</h1>
      </div>
      {report && (
        <Row gutter={16}>
          <Col span={24}>
            <Card>
              <Statistic
                title="Дата"
                value={new Date(report.date).toLocaleDateString("ru-RU")}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Всего задач" value={report.totalTasks} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Новых задач" value={report.newTasks} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Задач в процессе"
                value={report.inProgressTasks}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Завершённых задач"
                value={report.completedTasks}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Задач с высоким приоритетом"
                value={report.highPriorityTasks}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Задач со средним приоритетом"
                value={report.mediumPriorityTasks}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Задач с низким приоритетом"
                value={report.lowPriorityTasks}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Просроченных задач"
                value={report.overdueTasks}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Среднее время выполнения)"
                value={report.averageCompletionTime}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
