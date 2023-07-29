export const schema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
          }
        },
      },
    },
  },
};

export type StudySetResponse = {
  items: {
    question: string;
    answer: string;
  }[];
};
