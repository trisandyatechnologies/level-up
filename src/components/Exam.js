import React, { useEffect, useState } from "react";
import {
  Checkbox,
  List,
  Radio,
  Typography,
  Layout,
  Button,
  Popconfirm,
  Input,
  Result,
  Badge,
  theme,
  Flex,
  Row,
  Col,
  Pagination,
} from "antd";
import {
  FilterOutlined,
  SendOutlined,
  UnorderedListOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { green, red, blue, cyan } from "@ant-design/colors";

const { Header, Content } = Layout;

const hasResponse = (response, maxAnswers) => {
  return Array.isArray(response) && response.length === maxAnswers;
};

const optionStyles = (inReview, isAnswer, isResponse) => {
  if (inReview) {
    return {
      backgroundColor: isAnswer ? green[2] : isResponse ? red[2] : "",
    };
  }

  return {};
};

const RESULT_STATUS = {
  Passed: "Passed",
  Failed: "Failed",
  NotAttemted: "NotAttempted",
};

export default function Exam(props) {
  const [questions, setQuestions] = useState(props.questions);
  const [responses, setResponses] = useState({});
  const [inReview, setInReview] = useState(false);
  const [result, setResult] = useState({});
  const [showUnanswered, setShowUnanswered] = useState(false);
  const {
    token: { colorBgContainer, padding },
  } = theme.useToken();

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePagination = (page, pageSize) => {
    setPageSize(pageSize);
    setCurrentPage(page);
  };

  const handleChange =
    ({ id, options }) =>
    (value) => {
      if (inReview) return;
      if (options.length === 0 && value[0].trim().length === 0) {
        value = [];
      }
      setResponses({ ...responses, [id]: value });
    };

  const showUnansweredQuestions = () => {
    const filteredQuestions = questions.filter(
      (q, i) => !hasResponse(responses[q.id], q.maxAnswers)
    );
    setQuestions(filteredQuestions);
    setShowUnanswered(true);
  };

  const showAllQuestions = () => {
    setQuestions(props.questions);
    setShowUnanswered(false);
  };

  const handleSubmit = () => {
    setQuestions(props.questions);
    setShowUnanswered(false);
    const result = {
      status: RESULT_STATUS.Failed,
      score: 0,
      total: 0,
      each: {},
    };
    props.questions.forEach(({ id, answer, options = [], marks = 1 }) => {
      const response = responses[id];
      const isCorrectAnswer =
        options.length === 0
          ? answer.some((ans) => response.includes(ans))
          : answer.length === response.length &&
            answer.every((ans) => response.includes(ans));
      result.each[id] = isCorrectAnswer;
      result.total += marks;
      if (isCorrectAnswer) {
        result.score += 1;
      }
    });

    // 40%, should be configurable
    if (result.score > 0.4 * result.total) {
      result.status = RESULT_STATUS.Passed;
    }

    setResult(result);
    setInReview(true);
    // TODO: upload to server
  };

  const resetExam = () => {
    setResult({});
    setResponses({});
    setInReview(false);
  };

  useEffect(() => {
    // Paginated data
    const startIndex = Math.max(currentPage - 1, 0) * pageSize;
    setQuestions(props.questions.slice(startIndex, startIndex + pageSize));
  }, [currentPage, pageSize, props.questions]);

  return (
    <Layout style={{ backgroundColor: colorBgContainer }}>
      <Header style={{ backgroundColor: blue.primary }}></Header>
      <Content style={{ marginTop: 16 }}>
        {inReview && <ExamResult tryAgain={resetExam} result={result} />}
        <List size="large">
          {questions.map((question, questionIndex) => (
            <Question
              key={"q-" + questionIndex}
              {...question}
              handleChange={handleChange(question)}
              response={responses[question.id]}
              index={questionIndex}
              inReview={inReview}
            />
          ))}
          {showUnanswered && questions.length === 0 && (
            <Result
              icon={<SmileOutlined />}
              title="Looks like you have answered all the questions!"
              extra={
                <Button type="primary" onClick={showAllQuestions}>
                  Show all
                </Button>
              }
            />
          )}
          {!showUnanswered && questions.length === 0 && (
            <Result
              status="404"
              title="Looks like nothing here."
              subTitle="Sorry, check back some other time."
              extra={
                <Button type="primary" onClick={showAllQuestions}>
                  Back home
                </Button>
              }
            />
          )}
        </List>
      </Content>
      {!inReview && (
        <Row style={{ paddingTop: padding, paddingBottom: padding }}>
          <Col span={12}>
            <Pagination
              current={currentPage}
              onChange={handlePagination}
              total={props.questions.length}
              pageSize={pageSize}
              showSizeChanger
            />
          </Col>
          <Col span={12}>
            <Flex justify="flex-end" gap={padding}>
              {showUnanswered && (
                <Button
                  onClick={showAllQuestions}
                  icon={<UnorderedListOutlined />}
                  size="large"
                >
                  Show all
                </Button>
              )}
              {!showUnanswered && (
                <Button
                  onClick={showUnansweredQuestions}
                  icon={<FilterOutlined />}
                  size="large"
                >
                  Show unanswered
                </Button>
              )}
              <Popconfirm
                title="Are you sure submit the exam?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleSubmit}
              >
                <Button icon={<SendOutlined />} type="primary" size="large">
                  Submit
                </Button>
              </Popconfirm>
            </Flex>
          </Col>
        </Row>
      )}
    </Layout>
  );
}

function ExamResult(props) {
  const { result, tryAgain } = props;
  const isPassed = result.status === RESULT_STATUS.Passed;
  return (
    <Result
      status={isPassed ? "success" : "error"}
      title="You have completed the exam!"
      subTitle={`Score: ${result.score}/${result.total}`}
      extra={[
        <Button type={isPassed ? "primary" : "default"} key="console">
          Go Home
        </Button>,
        <Button
          type={!isPassed ? "primary" : "default"}
          key="buy"
          onClick={tryAgain}
        >
          Try Again
        </Button>,
      ]}
    />
  );
}

const STATUS = {
  Unanswered: "Unanswered",
  Answered: "Answered",
  Correct: "Correct",
  Incorrect: "Incorrect",
};

const STATUS_COLORS = {
  [STATUS.Unanswered]: blue.primary,
  [STATUS.Answered]: cyan.primary,
  [STATUS.Correct]: green.primary,
  [STATUS.Incorrect]: red.primary,
};

const badgeProps = ({ response = [], inReview, isCorrectAnswer }) => {
  let status = STATUS.Unanswered;
  if (inReview) {
    if (isCorrectAnswer) {
      status = STATUS.Correct;
    } else {
      status = STATUS.Incorrect;
    }
  } else {
    if (response.length > 0) {
      status = STATUS.Answered;
    }
  }

  return {
    text: status,
    color: STATUS_COLORS[status],
  };
};

function Question(props) {
  const { index, question, options, maxAnswers } = props;
  const isSingleAnswer = maxAnswers === 1 && options.length !== 0;
  const isMultiAnswer = maxAnswers > 1;
  const isCustomAnswer = options.length === 0;

  return (
    <Badge.Ribbon {...badgeProps(props)}>
      <List
        header={
          <Typography.Text strong>
            {index + 1}. {question}
          </Typography.Text>
        }
        size="large"
        bordered
        style={{ marginBottom: 16 }}
      >
        {isSingleAnswer && <SingleAnswer {...props} />}
        {isMultiAnswer && <MultipleAnswer {...props} />}
        {isCustomAnswer && <CustomAnswer {...props} />}
      </List>
    </Badge.Ribbon>
  );
}

function SingleAnswer(props) {
  const { options, handleChange, response, inReview, answer } = props;
  return (
    <Radio.Group
      onChange={(event) => handleChange([event.target.value])}
      buttonStyle="outline"
      style={{ display: "block" }}
      value={response?.[0]}
    >
      {options.map(({ value, label }) => (
        <List.Item
          key={value}
          style={optionStyles(
            inReview,
            answer?.includes(value),
            response?.includes(value)
          )}
        >
          <Radio value={value}>{label}</Radio>
        </List.Item>
      ))}
    </Radio.Group>
  );
}

function MultipleAnswer(props) {
  const { options, handleChange, response, inReview, answer } = props;
  return (
    <Checkbox.Group
      onChange={(value) => handleChange(value)}
      buttonStyle="outline"
      style={{ display: "block" }}
      value={response}
    >
      {options.map(({ value, label }) => (
        <List.Item
          key={value}
          style={optionStyles(
            inReview,
            answer?.includes(value),
            response?.includes(value)
          )}
        >
          <Checkbox value={value}>{label}</Checkbox>
        </List.Item>
      ))}
    </Checkbox.Group>
  );
}

function CustomAnswer(props) {
  const { handleChange, response, inReview, answer, isCorrectAnswer } = props;
  const isWrongAnswer = inReview && !isCorrectAnswer;
  return (
    <>
      <List.Item
        style={optionStyles(inReview, answer.includes(response?.[0]), true)}
      >
        <Input.TextArea
          rows={3}
          onChange={(event) => handleChange([event.target.value])}
          value={response?.[0]}
        />
      </List.Item>
      {isWrongAnswer && (
        <List.Item style={optionStyles(inReview, true, false)}>
          <Input.TextArea rows={3} value={answer?.join(", ")} />
        </List.Item>
      )}
    </>
  );
}
