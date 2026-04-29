import type { Question, LabelPart } from "@/types";

export const questions: Question[] = [
  {
    visual: "🦷",
    text: "Which teeth are the sharp, pointy ones on the sides that help us tear food?",
    options: ["Incisors", "Canines", "Molars", "Wisdom teeth"],
    answer: 1,
    fact: "Canines are named after dogs — they look just like a dog's sharp teeth! You have 4 of them.",
  },
  {
    visual: "😁",
    text: "How many baby teeth do children get in total?",
    options: ["16", "24", "20", "28"],
    answer: 2,
    fact: "You get 20 baby teeth, also called 'milk teeth'. They start falling out around age 6!",
  },
  {
    visual: "🦴",
    text: "What is the HARDEST part of your body — even harder than bone?",
    options: ["Dentin", "Pulp", "Enamel", "Root"],
    answer: 2,
    fact: "Tooth enamel is the hardest substance in the human body! It protects the softer layers inside.",
  },
  {
    visual: "🦠",
    text: "What mixes with sugar in your mouth to make an acid that causes cavities?",
    options: ["Saliva", "Bacteria", "Food bits", "Vitamins"],
    answer: 1,
    fact: "Bacteria eat sugar and release acid. That acid slowly eats away your enamel — that's a cavity!",
  },
  {
    visual: "🪥",
    text: "How many times a day should you brush your teeth?",
    options: ["Once", "Twice", "Three times", "Every hour"],
    answer: 1,
    fact: "Brushing twice a day — morning and before bed — removes the plaque bacteria live in. Two minutes each time!",
  },
  {
    visual: "🧮",
    text: "Which type of tooth is wide and flat and used for grinding food?",
    options: ["Canine", "Incisor", "Molar", "Bicuspid"],
    answer: 2,
    fact: "Molars are our grinding machines! They have a bumpy surface perfect for crushing food.",
  },
  {
    visual: "🌱",
    text: "What is the hidden part of the tooth that goes into your jawbone?",
    options: ["Crown", "Enamel", "Gum", "Root"],
    answer: 3,
    fact: "The root anchors your tooth into your jawbone. About two thirds of the tooth is hidden as root!",
  },
  {
    visual: "🎉",
    text: "How many permanent (adult) teeth do grown-ups have when all come in?",
    options: ["20", "28", "32", "36"],
    answer: 2,
    fact: "Adults can have up to 32 teeth including wisdom teeth — though many people have their wisdom teeth removed!",
  },
];

export const labelParts: LabelPart[] = [
  { id: 0, name: "Enamel", hint: "outer hard coating" },
  { id: 1, name: "Crown", hint: "the visible part" },
  { id: 2, name: "Pulp", hint: "soft centre with nerves" },
  { id: 3, name: "Gum line", hint: "where tooth meets gum" },
  { id: 4, name: "Root", hint: "anchors in jawbone" },
];

export const funFacts: string[] = [
  "Your teeth are as unique as your fingerprints — no two sets of teeth are exactly alike!",
  "Elephants grow 6 sets of teeth in their lifetime. Sharks can grow thousands!",
  "Tooth enamel cannot repair itself — once it's gone, it's gone! That's why brushing matters so much.",
  "Your saliva helps protect your teeth all day long. You make about 1 litre of it every day!",
];
