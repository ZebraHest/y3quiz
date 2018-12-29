$(document).ready(function() {
  var questionNumber = 0;
  var questionBank = new Array();
  var stage = "#game1";
  var stage2 = new Object;
  var questionLock = false;
  var numberOfQuestions;
  var score = 0;
  var lightAnswers = ["et maskindrevet skib","et maskindrevet skib, der slæber","et maskindrevet skib, der slæber, og slæbet er over 200 m","et sejlskib","beskæftiget med trawlfiskeri","beskæftiget med fiskeri, bortset fra trawlfiskeri","ikke under kommando","begrænset i sin manøvreevne","hæmmet af sin dybgang","beskæftiget med lodstjeneste","en ankerligger","stødt på grund","beskæftiget med minerydning","beskæftiget med uddybningsarbejde","let","gør fart gennem vandet","under 50 m i længde","set mod dets styrbords side","set mod dets bagbords side","set ret for fra","set agter fra"];

  $.getJSON('lightQuestion.json', function(data) {
    for(i=0; i < data.list.length; i++){
      questionBank[i] = data.list[i];
    }
    shuffle(questionBank);
    numberOfQuestions = questionBank.length;
    displayLightQuestion();
  })//getJSON

  function displayLightQuestion(){
    window.scrollTo(0,0);

    $(stage).append('<div class = "questionText">' + "Marker med kryds, hvilke oplysninger de viste lys eller signalfigurer giver dig om skibet på figuren"+'</div>')

    var pic = questionBank[questionNumber].picture;
    $(stage).append('<div id= "pix" class = "pix"><img class="sticky" src="img/lanterner/'+pic+'"></div>')

    for(i=0 ; i<lightAnswers.length; i++){
      $(stage).append('<label class="container">'+lightAnswers[i]+'<input type="checkbox" id = "lightAnswer'+i+'"><span class="checkmark"></span></label>');
    }

    $(stage).append('<div class = "submit"> Svar </div>');

    $('.submit').click(function(){
      var correctAnswers = true;
      var answers = new Array;
      for(i=0 ; i<lightAnswers.length; i++){
        var test = document.getElementById("lightAnswer"+i).checked;
        answers[i] = test;
        if (questionBank[questionNumber].answerList[i] !== test) {
          correctAnswers = false;
        }
      }
      submitFunction(correctAnswers, answers)
    });
  }

  function displayLightAnswer(correct, answers){
    window.scrollTo(0,0);
    var pic = questionBank[questionNumber].picture;
    var stringCorrect = "Forkert";
    if (correct) {
      stringCorrect = "Korrekt";
      score++;
    }

    $(stage).append('<div class = "questionText">' +stringCorrect+ " "+score+"/"+(questionNumber+1)+'</div>')

    $(stage).append('<div id= "pix" class = "pix"><img  class="sticky" src="img/lanterner/'+pic+'"></div>')

    $(stage).append('<div class = "questionText">' +"Svar:"+'</div>')
    $(stage).append('<div class = "answerText">' +questionBank[questionNumber].description+'</div>')

    if (!correct) {
      $(stage).append('<div class = "questionText">' +"Du svarede:"+'</div>')
      var answerString = "";
      var first = true;
      for(i=0 ; i<lightAnswers.length; i++){
        if (answers[i]) {

          if (!first) {
            answerString += ", ";
          }
          first = false;
          answerString += lightAnswers[i];
        }
      }
      $(stage).append('<div class = "answerText">' +answerString+'</div>')
    }

    $(stage).append('<div class = "submit">Næste</div>');

    $('.submit').click(function(){
      changeQuestion()
    });
  }

  function submitFunction(correct, answers){
    if(stage == "#game1"){
      stage2 = "#game1";
      stage = "#game2";
    }else{
      stage2 = "#game2";
      stage = "#game1";
    }
    displayLightAnswer(correct, answers);

    $(stage2).animate({"right":"+=800px"} , "slow", function() {
      $(stage2).css('right' , '-800px');
      $(stage2).empty();
    })
    $(stage).animate({"right":"+=800px"} , "slow", function(){questionLock = false;});
  }

  function changeQuestion(){
    questionNumber++;

    if(stage == "#game1"){
      stage2 = "#game1";
      stage = "#game2";
    }else{
      stage2 = "#game2";
      stage = "#game1";
    }
    if(questionNumber < numberOfQuestions){
      displayLightQuestion();
    }else{
      displayFinalSlide();
    }

    $(stage2).animate({"right":"+=800px"} , "slow", function() {
      $(stage2).css('right' , '-800px');
      $(stage2).empty();
    })
    $(stage).animate({"right":"+=800px"} , "slow", function(){questionLock = false;});
  }

  function displayFinalSlide(){

    $(stage).append('<div class="questionText">You have finished the quiz!<br><br>Total questions: '+numberOfQuestions+'<br>Correct answers: '+score+'</div>');

  }

  function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
  }


});
