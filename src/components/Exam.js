import React, { useState } from "react";
import { Checkbox, Divider, List, Radio, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";

export default function Exam(props) {
  const { questions } = props;
  const [responses, setResponses] = useState(new Array(questions.length));

  const handleChange = (index, value) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = value;
    setResponses(updatedResponses);
  };

  return (
    <div>
      {questions.map((question, questionIndex) => (
        <Question
          {...question}
          handleChange={handleChange}
          index={questionIndex}
        />
      ))}
    </div>
  );
}

function Question(props) {
  const { question, options, maxAnswers, handleChange, index } = props;
  const isSingleChoice = maxAnswers === 1 && options.length !== 0;
  const isMultiChoice = maxAnswers > 1;
  const isCustomAnswer = options.length === 0;
  return (
    <div>
      <List
        header={
          <Typography.Title level={5} style={{ textAlign: "left" }}>
            {question}
          </Typography.Title>
        }
        size="large"
        bordered
        dataSource={options}
      >
        {isSingleChoice && (
          <Radio.Group
            onChange={(value) => handleChange(index, value)}
            buttonStyle="outline"
            style={{ display: "block" }}
          >
            <QuestionSingleChoice {...props} />
          </Radio.Group>
        )}
        {isMultiChoice && (
          <Checkbox.Group
            onChange={(value) => handleChange(index, value)}
            buttonStyle="outline"
            style={{ display: "block" }}
          >
            <QuestionMultiChoice {...props} />
          </Checkbox.Group>
        )}
        {isCustomAnswer && <QuestionContent {...props} />}
      </List>
      <Divider />
    </div>
  );
}

function QuestionSingleChoice(props) {
  const { question, options, maxAnswers, handleChange, index } = props;
  return (
    <>
      {options.map(({ value, label }) => (
        <List.Item>
          <Radio skipGroup name={question} value={value}>
            {label}
          </Radio>
        </List.Item>
      ))}
    </>
  );
}

function QuestionMultiChoice(props) {
  const { question, options, maxAnswers, handleChange, index } = props;
  return (
    <>
      {options.map(({ value, label }) => (
        <List.Item>
          <Checkbox value={value} onChange={() => handleChange(index, value)}>
            {label}
          </Checkbox>
        </List.Item>
      ))}
    </>
  );
}

function QuestionContent(props) {
  const { handleChange, index } = props;
  return (
    <List.Item>
      <TextArea rows={4} />
    </List.Item>
  );
}
