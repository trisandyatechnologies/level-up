export const MOCK_DATA = [
  {
    id: "q-1",
    question: "Not a primitive data type",
    maxAnswers: 1,
    options: [
      {
        value: 1,
        label: "Number",
      },
      {
        value: 2,
        label: "String",
      },
      {
        value: 3,
        label: "Boolean",
      },
      {
        value: 4,
        label: "Array",
      },
    ],
    answer: [4],
  },
  {
    id: "q-2",
    question: "Name one reference data type",
    maxAnswers: 1,
    options: [],
    answer: ["array", "object"],
  },
  {
    id: "q-3",
    question: "Property to find number of elements in an array",
    maxAnswers: 1,
    options: [
      {
        value: 1,
        label: "length",
      },
      {
        value: 2,
        label: "size",
      },
      {
        value: 3,
        label: "size()",
      },
      {
        value: 4,
        label: "length()",
      },
    ],
    answer: [1],
  },
  {
    id: "q-4",
    question: "Is HTML a programming language?",
    maxAnswers: 1,
    options: [
      {
        value: 1,
        label: "Yes",
      },
      {
        value: 0,
        label: "No",
      },
    ],
    answer: [1],
  },
  {
    id: "q-5",
    question: "JavaScript can be added inside ",
    maxAnswers: 2,
    options: [
      {
        value: 1,
        label: "<head></head>",
      },
      {
        value: 2,
        label: "<body></body>",
      },
      {
        value: 3,
        label: "<html><html>",
      },
      {
        value: 4,
        label: "<link></link>",
      },
    ],
    answer: [1, 2],
  },
];
