import { Col, Container, Row } from "react-bootstrap";
import StatsCard from "@/components/StatsCard/StatsCard";
import Earning from "@/components/Earning/Earning";
import Download from "@/components/Download/Download";
import Revenue from "@/components/Revenue/Revenue";
import { Stats, StatsTab } from "@/components/Stats/Stats";
import SocialCounter from "@/components/SocialCounter/SocialCounter";
import Timeline from "@/components/Timeline/Timeline";
import AnalyticsStats from "@/components/AnalyticsStats/AnalyticsStats";
import WeatherStats from "@/components/WeatherStats/WeatherStats";
import SocialStats from "@/components/SocialStats/SocialStats";
import MonthlyStats from "@/components/MonthlyStats/MonthlyStats";
import DeviceVisitorStats from "@/components/DeviceVisitorStats/DeviceVisitorStats";
import Day from "@/components/Stats/Day";
import Month from "@/components/Stats/Month";
import Year from "@/components/Stats/Year";

const Dashboard = () => {
    return (
        <Container fluid className="p-0">
            {/* start revenue section */}
            <Row className="gy-4 gx-4 mb-4">
                <Col sm={12} md={6} lg={3} xl={3}>
                    <StatsCard
                        type="revenue-progressBar"
                        bgColor="#5c6bc0"
                        symbol="%"
                        symbolPosition="right"
                        counter={89}
                        isCounter={true}
                        title="Lorem ipsum..."
                        progressPercent={25}
                        description="Lorem ipsum dolor sit amet enim."
                    />
                </Col>
                <Col sm={12} md={6} lg={3} xl={3}>
                    <StatsCard
                        type="revenue-progressBar"
                        bgColor="#ffa726"
                        counter={12124}
                        isCounter={true}
                        title="Lorem ipsum..."
                        progressPercent={25}
                        description="Lorem ipsum dolor sit amet enim."
                    />
                </Col>
                <Col sm={12} md={6} lg={3} xl={3}>
                    <StatsCard
                        type="revenue-progressBar"
                        bgColor="#ef5350"
                        symbol="$"
                        counter={9811100}
                        isCounter={true}
                        title="Lorem ipsum..."
                        progressPercent={25}
                        description="Lorem ipsum dolor sit amet enim."
                    />
                </Col>
                <Col sm={12} md={6} lg={3} xl={3}>
                    <StatsCard
                        type="revenue-progressBar"
                        bgColor="#42a5f5"
                        symbol="$"
                        counter={9811100}
                        isCounter={true}
                        title="Lorem ipsum..."
                        progressPercent={25}
                        description="Lorem ipsum dolor sit amet enim."
                    />
                </Col>
            </Row>
            {/* end revenue section */}

            {/* start analytics stats, weather stats, user stats, monthly stats & device visitor stats section */}
            <Row className="gy-4 gx-4 mb-4">
                <Col className="" md={12} lg={6}>
                    <AnalyticsStats />
                </Col>
                <Col md={12} lg={6}>
                    <Row className="gy-4 gx-4">
                        <Col md={6}>
                            <WeatherStats />
                        </Col>
                        <Col md={6}>
                            <SocialStats />
                        </Col>
                    </Row>
                    <Col className="mt-4">
                        <Row className="gy-4 gx-4">
                            <Col md={6}>
                                <MonthlyStats />
                            </Col>
                            <Col md={6}>
                                <DeviceVisitorStats />
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
            {/* end analytics stats, weather stats, user stats, monthly stats & device visitor stats section */}

            {/* start earning and download  revenue section */}
            <Row className="gy-4 gx-4 mb-4">
                <Col cmd={12} lg={6} xl={6}>
                    <Earning />
                </Col>
                <Col cmd={12} lg={6} xl={6}>
                    <Row className="gy-4 gx-4">
                        <Col sm={12} md={6}>
                            <Download />
                        </Col>
                        <Col sm={12} md={6}>
                            <Revenue />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* end earning and download  revenue section */}

            {/* start user table, social counter & timeline section */}
            <Row className="gy-4 gx-4">
                <Col md={12} lg={8} xl={8}>
                    <Col className="mb-4" sm={12}>
                        <Stats activeTab="day">
                            <StatsTab eventKey="day" title="Day">
                                <Day />
                            </StatsTab>
                            <StatsTab eventKey="Month" title="Month">
                                <Month />
                            </StatsTab>
                            <StatsTab eventKey="year" title="Year">
                                <Year />
                            </StatsTab>
                        </Stats>
                    </Col>
                    <Row className="gy-4 gx-4">
                        <Col sm={12} md={4}>
                            <SocialCounter
                                padding="28px"
                                bgColor="#1DA1F2"
                                icon="fa-brands fa-twitter"
                                count="1875980"
                                isCounter={true}
                            />
                        </Col>
                        <Col sm={12} md={4}>
                            <SocialCounter
                                padding="28px"
                                bgColor="#3B5998"
                                icon="fa-brands fa-facebook-f"
                                count="1875980"
                                isCounter={true}
                            />
                        </Col>
                        <Col sm={12} md={4}>
                            <SocialCounter
                                padding="28px"
                                bgColor="#833AB4"
                                icon="fa-brands fa-instagram"
                                count="1875980"
                                isCounter={true}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md={12} lg={4} xl={4}>
                    <Timeline />
                </Col>
            </Row>
            {/* end user table, social counter & timeline section */}
        </Container>
    );
};

export default Dashboard;

