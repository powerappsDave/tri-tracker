import {  LoremIpsum } from "lorem-ipsum";

type TrainingDaySeed = {
  week_id: number;
  day: string;
  activity: string;
  completed: boolean;
  activity_type: string;
  description: string
  notes: string;
};

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const basePlan = [
  ["Swim - 500m", "Bike - 20km", "Run - 5km", "Rest", "Swim - 600m", "Bike - 25km", "Run - 6km"],
  ["Swim - 600m", "Bike - 22km", "Run - 6km", "Rest", "Swim - 700m", "Brick - Bike 20km + Run 3km", "Run - 7km"],
  ["Swim - 700m", "Bike - 25km", "Run - 6km", "Rest", "Swim - 750m", "Bike - 30km", "Run - 8km"],
  ["Swim - 800m", "Bike - 28km", "Run - 7km", "Rest", "Swim - 800m", "Brick - Bike 25km + Run 5km", "Run - 9km"],
  ["Swim - 850m", "Bike - 30km", "Run - 8km", "Rest", "Swim - 900m", "Bike - 35km", "Run - 10km"],
  ["Swim - 900m", "Bike - 35km", "Run - 8km", "Rest", "Swim - 950m", "Brick - Bike 30km + Run 6km", "Run - 11km"],
  ["Swim - 950m", "Bike - 38km", "Run - 9km", "Rest", "Swim - 1000m", "Bike - 40km", "Run - 12km"],
  ["Swim - 1000m", "Bike - 40km", "Run - 10km", "Rest", "Swim - 1100m", "Brick - Bike 35km + Run 7km", "Run - 13km"],
  ["Swim - 1100m", "Bike - 45km", "Run - 11km", "Rest", "Swim - 1200m", "Bike - 50km", "Run - 14km"],
  ["Swim - 1200m", "Bike - 48km", "Run - 12km", "Rest", "Swim - 1250m", "Brick - Bike 40km + Run 8km", "Run - 15km"],
  ["Swim - 1000m", "Bike - 30km", "Run - 8km", "Rest", "Swim - 900m", "Bike - 25km", "Run - 6km"], // Taper week
  ["Race Day Prep Swim", "Rest", "Short Run - 3km", "Rest", "Swim - 500m", "Rest", "Race Day!"]     // Race week
];

const trainingDaysSeed: TrainingDaySeed[] = [];
let at = '';

for (let week = 1; week <= 12; week++) {
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    switch(basePlan[week - 1][dayIndex].substring(0, 4).toUpperCase()){
    case "SWIM":
        // code for condition1 to run goes here
        at = "Swim"
        break
    case "BIKE":
        // code for condition2 to run goes here
        at = "Cycle"
        break
    case "RUN ":
        at = "Run"
        //code here
        break
    case "REST":
        //code here
        at = "Rest"
        break
    case "BRIC":
        //code here
        at = "Brick"
        break
    case "RACE":
        //code here
        at = "Race"
        break
}

console.log(`${at} - ${basePlan[week - 1][dayIndex]}`)
    trainingDaysSeed.push({
      week_id: week,
      day: daysOfWeek[dayIndex],
      activity: basePlan[week - 1][dayIndex],
      activity_type: at,
      description: lorem.generateSentences(3),
      completed: false,
      notes: ""
    });
  }
}

export default trainingDaysSeed;
