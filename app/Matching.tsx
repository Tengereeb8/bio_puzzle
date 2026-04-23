import { useState } from "react";

export const Match = () => {
  const items = [
    { id: "digestive", name: "Зүрх", description: "Цус шахах эрхтэн" },
    { id: "lungs", name: "Уушиг", description: "Амьсгалах эрхтэн" },
    { id: "brain", name: "Тархи", description: "Удирдах эрхтэн" },
  ];
  const [quiz, setQuiz] = useState();
  return (
    <div>
      <h1>Шинж тэмдгийг тааруул</h1>
      <p>Шинж тэмдэг дээр дараад, хамаарах систем дээр дарна уу!</p>
    </div>
  );
};
