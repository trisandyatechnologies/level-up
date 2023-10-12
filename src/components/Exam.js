import React, { useState } from "react";
import { Checkbox, Divider, List, Radio, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";

export default function Exam(props) {
  const { questions } = props;
  const [responses, setResponses] = useState(new Array(questions.length));

  const handleChange = (index) => (value) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = value;
    setResponses(updatedResponses);
  };

  return (
    <div>
      {questions.map((question, questionIndex) => (
        <Question {...question} handleChange={handleChange(questionIndex)} />
      ))}
    </div>
  );
}

function Question(props) {
  const { question, options, maxAnswers } = props;
  const isSingleAnswer = maxAnswers === 1 && options.length !== 0;
  const isMultiAnswer = maxAnswers > 1;
  const isCustomAnswer = options.length === 0;
  return (
    <div>
      <List
        header={
          <Typography.Text strong level={5} style={{ textAlign: "left" }}>
            {question}
          </Typography.Text>
        }
        size="large"
        bordered
      >
        {isSingleAnswer && <SingleAnswer {...props} />}
        {isMultiAnswer && <MultipleAnswer {...props} />}
        {isCustomAnswer && <CustomAnswer {...props} />}
      </List>
      <Divider />
    </div>
  );
}

function SingleAnswer(props) {
  const { options, handleChange } = props;
  return (
    <Radio.Group
      onChange={(event) => handleChange(event.target.value)}
      buttonStyle="outline"
      style={{ display: "block" }}
    >
      {options.map(({ value, label }) => (
        <List.Item>
          <Radio value={value}>{label}</Radio>
        </List.Item>
      ))}
    </Radio.Group>
  );
}

function MultipleAnswer(props) {
  const { options, handleChange } = props;
  return (
    <Checkbox.Group
      onChange={(value) => handleChange(value)}
      buttonStyle="outline"
      style={{ display: "block" }}
    >
      {options.map(({ value, label }) => (
        <List.Item>
          <Checkbox value={value}>{label}</Checkbox>
        </List.Item>
      ))}
    </Checkbox.Group>
  );
}

function CustomAnswer(props) {
  const { handleChange } = props;

  return (
    <List.Item>
      <TextArea
        rows={4}
        onChange={(event) => handleChange(event.target.value)}
      />
    </List.Item>
  );
}
