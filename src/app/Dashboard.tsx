"use client";
import {
  AreaChart,
  BadgeDelta,
  Bold,
  Card,
  CategoryBar,
  Col,
  Color,
  DeltaBar,
  DeltaType,
  DonutChart,
  Flex,
  Grid,
  LineChart,
  List,
  ListItem,
  Metric,
  Select,
  SelectItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
} from "@tremor/react";
import { useEffect, useState } from "react";

const data = [
  {
    Month: "Jan 21",
    Sales: 2890,
    Profit: 2400,
    Customers: 4938,
  },
  {
    Month: "Feb 21",
    Sales: 1890,
    Profit: 1398,
    Customers: 2938,
  },
  // ...
  {
    Month: "Jul 21",
    Sales: 3490,
    Profit: 4300,
    Customers: 2345,
  },
];

const industries = [
  { key: "all", name: "All industries" },
  { key: "tech", name: "Tech" },
  { key: "health", name: "Health" },
  { key: "manufacturing", name: "Manufacturing" },
];

interface AssetData {
  name: string;
  industry: string;
  sales: number;
  delta: number;
  deltaType: DeltaType;
  status: Color;
}

const cities: AssetData[] = [
  {
    name: "Off Running Inc.",
    industry: "tech",
    sales: 984888,
    delta: 61.3,
    deltaType: "increase",
    status: "emerald",
  },
  {
    name: "Black Swan Holding",
    industry: "health",
    sales: 456700,
    delta: 32.8,
    deltaType: "moderateDecrease",
    status: "emerald",
  },
  {
    name: "Blingtech Inc.",
    industry: "Tech",
    sales: 390800,
    delta: -18.3,
    deltaType: "moderateDecrease",
    status: "rose",
  },
  {
    name: "Cortina Steal AG",
    industry: "manufacturing",
    sales: 240000,
    delta: 19.4,
    deltaType: "moderateIncrease",
    status: "emerald",
  },
  {
    name: "Rain Drop Holding",
    industry: "health",
    sales: 190800,
    delta: -19.4,
    deltaType: "moderateIncrease",
    status: "rose",
  },
  {
    name: "Pas Crazy Inc.",
    industry: "tech",
    sales: 164400,
    delta: -32.8,
    deltaType: "decrease",
    status: "rose",
  },
  {
    name: "Hype Room Inc.",
    industry: "manufacturing",
    sales: 139800,
    delta: -40.1,
    deltaType: "moderateIncrease",
    status: "rose",
  },
];

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()} $`;

const filterByindustry = (industry: string, data: AssetData[]) =>
  industry === "all" ? data : data.filter((city) => city.industry === industry);

const categories: {
  title: string;
  metric: string;
  metricPrev: string;
  delta: string;
  deltaType: DeltaType;
}[] = [
  {
    title: "Sales",
    metric: "$ 12,699",
    metricPrev: "$ 9,456",
    delta: "34.3%",
    deltaType: "moderateIncrease",
  },
  {
    title: "Profit",
    metric: "$ 12,348",
    metricPrev: "$ 10,456",
    delta: "18.1%",
    deltaType: "moderateIncrease",
  },
  {
    title: "Customers",
    metric: "948",
    metricPrev: "1,082",
    delta: "12.3%",
    deltaType: "moderateDecrease",
  },
];
const generateNewData = (
  startValue: number,
  count: number,
  startDate: Date,
): Array<{ Date: string; "Customer Churn": number }> => {
  let result = [];
  let newValue = startValue;
  const variance = 0.05; // allow up to 2% variance

  for (let i = 0; i < count; i++) {
    newValue += newValue * (Math.random() * variance * 2 - variance);
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + (i + 1));
    const formattedDate = newDate.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    result.push({
      Date: formattedDate,
      "Customer Churn": Math.round(newValue * 100) / 100,
    });
  }
  return result;
};

const startDate = new Date("2021-03-13");
const count = 150;

const chartData = {
  relative: [
    { Date: "01.01.2021", "Customer Churn": 9.73 },
    { Date: "02.01.2021", "Customer Churn": 10.74 },
    { Date: "13.02.2021", "Customer Churn": 8.82 },
    ...generateNewData(8.82, count, startDate),
  ],
  absolute: [
    { Date: "01.01.2021", "Customer Churn": 90 },
    { Date: "02.01.2021", "Customer Churn": 100 },
    { Date: "13.03.2021", "Customer Churn": 88 },
    ...generateNewData(88, count, startDate),
  ],
};

const valueFormatterRelative = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}%`;

const valueFormatterAbsolute = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export default function Dashboard() {
  const [selectedindustry, setSelectedindustry] = useState("all");
  const [filteredData, setFilteredData] = useState(cities);

  useEffect(() => {
    const data = cities;
    setFilteredData(filterByindustry(selectedindustry, data));
  }, [selectedindustry]);

  return (
    <Flex className="w-full gap-6" flexDirection="col">
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6 w-full">
        {categories.map((item) => (
          <Card key={item.title}>
            <Flex alignItems="start">
              <Text>{item.title}</Text>
              <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
            </Flex>
            <Flex
              className="space-x-3 truncate"
              justifyContent="start"
              alignItems="baseline"
            >
              <Metric>{item.metric}</Metric>
              <Text>from {item.metricPrev}</Text>
            </Flex>
            <AreaChart
              className="mt-6 h-28"
              data={data}
              index="Month"
              valueFormatter={(number: number) =>
                `$ ${Intl.NumberFormat("us").format(number).toString()}`
              }
              categories={[item.title]}
              colors={["blue"]}
              showXAxis={true}
              showGridLines={false}
              startEndOnly={true}
              showYAxis={false}
              showLegend={false}
            />
          </Card>
        ))}
      </Grid>
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 w-full">
        <Col numColSpanLg={1}>
          <Card className="w-full">
            <Card>
              <Flex>
                <Text className="truncate">Overall Performance Score</Text>
                <BadgeDelta deltaType="moderateIncrease">13.1%</BadgeDelta>
              </Flex>
              <Flex
                justifyContent="start"
                alignItems="baseline"
                className="space-x-1"
              >
                <Metric>65</Metric>
                <Text>/100</Text>
              </Flex>
              <CategoryBar
                values={[10, 25, 45, 20]}
                colors={["emerald", "yellow", "orange", "red"]}
                markerValue={65}
                tooltip="65%"
                className="mt-2"
              />
            </Card>
            <Grid numItemsSm={2} className="mt-4 gap-4">
              {categories.map((item) => (
                <Card key={item.title}>
                  <Metric className="mt-2 truncate">{item.metric}</Metric>
                  <Text>{item.title}</Text>
                </Card>
              ))}
            </Grid>
          </Card>
        </Col>
        <Col numColSpanLg={2} className="w-full">
          <Card className="  h-full">
            <div className="hidden sm:block">
              <Flex
                className="space-x-4"
                justifyContent="start"
                alignItems="center"
              >
                <Title className="truncate">Asset Performance</Title>
                <Select
                  onValueChange={setSelectedindustry}
                  placeholder="Industry Selection"
                  className="max-w-xs"
                >
                  {industries.map((industry) => (
                    <SelectItem key={industry.key} value={industry.key}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </Select>
              </Flex>
            </div>
            {/* --- Same code snippet as above but with no flex to optmize mobile view --- */}
            <div className="sm:hidden">
              <Title className="truncate">Asset Performance</Title>
              <Select
                onValueChange={setSelectedindustry}
                placeholder="Industry Selection"
                className="max-w-full mt-2"
              >
                {industries.map((industry) => (
                  <SelectItem key={industry.key} value={industry.key}>
                    {industry.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Grid numItemsLg={3} className="mt-8 gap-y-10 gap-x-14">
              <Flex>
                <DonutChart
                  data={filteredData}
                  category="sales"
                  index="name"
                  variant="donut"
                  valueFormatter={valueFormatter}
                  className="h-52"
                />
              </Flex>
              <Col numColSpan={1} numColSpanLg={2}>
                <Flex>
                  <Text className="truncate">
                    <Bold>Asset</Bold>
                  </Text>
                  <Text>
                    <Bold>+/-% since transaction </Bold>
                  </Text>
                </Flex>
                <div className="hidden sm:block">
                  <List className="mt-2">
                    {filteredData.map((city) => (
                      <ListItem key={city.name}>
                        <Text className="truncate">{city.name}</Text>
                        <div>
                          <Flex justifyContent="end" className="space-x-4">
                            <Text color={city.status} className="truncate">
                              {Intl.NumberFormat("us", {
                                signDisplay: "exceptZero",
                              })
                                .format(city.delta)
                                .toString()}
                              &#37;
                            </Text>
                            <div className="w-44">
                              <DeltaBar
                                value={city.delta}
                                isIncreasePositive={true}
                                tooltip=""
                                showAnimation={true}
                              />
                            </div>
                          </Flex>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </div>
                {/* --- Same code snippet as above but with less width for data bars to optimize mobile --- */}
                <div className="sm:hidden">
                  <List className="mt-2">
                    {filteredData.map((city) => (
                      <ListItem key={city.name}>
                        <Text className="truncate">{city.name}</Text>
                        <div>
                          <Flex justifyContent="end" className="space-x-4">
                            <Text color={city.status} className="truncate">
                              {city.delta}%{" "}
                            </Text>
                            <div className="w-20">
                              <DeltaBar
                                value={city.delta}
                                isIncreasePositive={true}
                                tooltip=""
                                showAnimation={true}
                              />
                            </div>
                          </Flex>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Col>
            </Grid>
          </Card>
        </Col>
      </Grid>
      <Card>
        <TabGroup>
          <div className="block sm:flex sm:justify-between">
            <div>
              <Title>Churn Rate</Title>
              <Text>Lost customers per day</Text>
            </div>
            <div className="mt-4 sm:mt-0">
              <TabList variant="solid">
                <Tab>relative</Tab>
                <Tab>absolute</Tab>
              </TabList>
            </div>
          </div>
          <TabPanels>
            <TabPanel>
              <LineChart
                className="mt-8 h-80"
                data={chartData.relative}
                index="Date"
                categories={["Customer Churn"]}
                colors={["blue"]}
                showLegend={false}
                valueFormatter={valueFormatterRelative}
                yAxisWidth={40}
              />
            </TabPanel>
            <TabPanel>
              <LineChart
                className="mt-8 h-80"
                data={chartData.absolute}
                index="Date"
                categories={["Customer Churn"]}
                colors={["blue"]}
                showLegend={false}
                valueFormatter={valueFormatterAbsolute}
                yAxisWidth={40}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </Flex>
  );
}
