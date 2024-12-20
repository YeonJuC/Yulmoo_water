let detector;
let detectedObjects = [];
let img_ratio;
let detections= [];

// Video
let video;
let flippedVideo;

let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/67h3-j81E/';
let label = "";

// 율무와 버터 라벨 설정
let YULMOO = 'Yulmoo';
let BUTTER = 'Butter';

let videoFrame;
let state = 0;

let btn_pause = [];
let btn_record = [];
let btn_stop = [];
let stateIndicator = [];
let recordingTime = '00:00:00'; //Text type variable
let recordingStartTime = 0; //Number type varialbe
let pausedStartTime = 0; //Number type variable
let pausedTime = 0; //Number type variable
let totalPausedTime = 0; //Number type variable

// 구역 설정
let litterBox1 = { x: 0, y: 245, width: 145, height: 140 };
let litterBox2 = { x: 245, y: 245, width: 145, height: 140 };
let waterBowl = { x: 0, y: 390, width: 120, height: 95 };

let yulmoo, butter, yulmoo_content, butter_content,poop_ellipse,water_ellipse;
let state_water, state_poop, Video_image,Bar_Time, LOGO;

let currentState = null;
let showStats = true; 

let videoElement;
let selectedCatName = ''; 
let isVideoPlaying = false;
let timeDisplayed = false;
let videoPlaying = false; 

function preload() {
  detector = ml5.objectDetector('cocossd');
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  
  videoFrame = loadImage('img/video_preview.png');
  
  btn_pause[0] = loadImage('img/pause_disabled.png');
  btn_pause[1] = loadImage('img/pause_activated.png');
  btn_record[0] = loadImage('img/record_stop.png');
  btn_record[1] = loadImage('img/record_recording.png');
  btn_record[2] = loadImage('img/record_paused.png');
  btn_record[3] = loadImage('img/record_saved.png');
  btn_stop[0] = loadImage('img/stop_disabled.png');
  btn_stop[1] = loadImage('img/stop_activated.png');
  
  stateIndicator[0] = loadImage('img/tapToRecord.png');
  stateIndicator[1] = loadImage('img/state_recording.png');
  stateIndicator[2] = loadImage('img/state_paused.png');
  stateIndicator[3] = loadImage('img/state_saved.png');
  
  Bar_Time = loadImage('img/bar_time.png');
  LOGO = loadImage('img/logo.png');
  
  YULMOO = loadImage('img/yulmoo.png');
  BUTTER = loadImage('img/butter.png');
  yulmoo = loadImage('img/yulmoo.png');
  butter = loadImage('img/butter.png');
  YULMOO_SELECTED = loadImage('img/yulmoo_click.png'); // 율무 클릭 시 변경될 이미지
  BUTTER_SELECTED = loadImage('img/butter_click.png'); // 버터 클릭 시 변경될 이미지
  
  PLUS = loadImage('img/plus.png');
  SPOT = loadImage('img/spot_3.png');
  
  WATER = loadImage('img/water.png');
  Defecation = loadImage('img/defecation.png');
  Arrow = loadImage('img/arrow.png');
  
  Video_image = loadImage('img/video_image.png');
  content = loadImage('img/content.png');
  state_water = loadImage('img/state_water.png');
  state_poop = loadImage('img/state_poop.png');
  water_ellipse = loadImage('img/water_ellipse.png');
  poop_ellipse = loadImage('img/poop_ellipse.png');
  Line = loadImage('img/Line 77.png');
  
  bar_background = loadImage('img/bar_background.png');
  home_icon = loadImage('img/home_icon.png');
  record_icon = loadImage('img/record_icon.png');
  cam_icon = loadImage('img/cam_icon.png');
  mypage_icon = loadImage('img/mypage_icon.png');
  
  butter_content = loadImage('img/butter_content.png');
  yulmoo_content = loadImage('img/yulmoo_content.png');
}

function setup() {
  createCanvas(390, 844);
  video = createVideo('video/yulmoo_water.mp4', videoLoaded); 
  video.hide();
  
  detector = ml5.objectDetector('cocossd', modelLoaded);
  //율무, 버터 클릭 이미지 변경하는 코드
  const yulmooImg = createImg('img/yulmoo.png', 'Yulmoo Image');
    yulmooImg.position(30, 105);
    yulmooImg.size(66, 84);
    yulmooImg.mousePressed(() => {
      selectedCatName = 'Yulmoo';
      yulmooImg.attribute('src', 'img/yulmoo_click.png'); // 이미지 변경
      butterImg.attribute('src', 'img/butter.png'); // 다른 이미지는 기본 상태로
  });

    const butterImg = createImg('img/butter.png', 'Butter Image');
    butterImg.position(112, 105);
    butterImg.size(66, 84);
    butterImg.mousePressed(() => {
      selectedCatName = 'Butter';
      butterImg.attribute('src', 'img/butter_click.png'); // 이미지 변경
      yulmooImg.attribute('src', 'img/yulmoo.png'); // 다른 이미지는 기본 상태로
  });
  
  startTime = millis();
  
  resizedWaterEllipse = water_ellipse.get();
  resizedWaterEllipse.resize(6, 6);
  
  resizedPoopEllipse = poop_ellipse.get();
  resizedPoopEllipse.resize(6, 6);
  
  resizedStateWater = state_water.get();
  resizedStateWater.resize(61, 59);
  
  resizedStatePoop = state_poop.get();
  resizedStatePoop.resize(61, 59);
  
  resizedYulmooContent = yulmoo_content.get();
  resizedYulmooContent.resize(147, 59);
  
  resizedButterContent = butter_content.get();
  resizedButterContent.resize(147, 59);
  
  resizedVideoImage = Video_image.get();
  resizedVideoImage.resize(43, 42);
}


function videoLoaded() {
  try {
    console.log("Video loaded successfully");
    video.size(390, 239);
    video.position(0, 246); 
    video.play();
    video.volume(0);
  } catch (error) {
    console.error("Error loading video:", error);
  }
}
function videoLoaded2() {
  try {
    console.log("Video loaded successfully");
    video.size(390, 239);
    video.position(0, 246); 
    video.play();
    video.volume(0);
  } catch (error) {
    console.error("Error loading video:", error);
  }
}
function modelLoaded() {
  console.log('Model loaded!');
  detectVideo(); // Start detection
}
function detectVideo() {
  if (video.elt.readyState === 4) { // 비디오가 준비되었는지 확인
    detector.detect(video, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      detections = results; // 감지 결과 저장
      detectVideo(); // 탐지 반복
    });
  } else {
    console.log('Video is not ready. Waiting...');
    setTimeout(detectVideo, 100); // 100ms 후 재시도
  }
}

function draw() {
  background(243,244,248);
  
  image(Bar_Time, 0, 0, 390, 211);
  image(LOGO, 32, 54, 36, 36);
  
  image(PLUS, 305, 60, 17, 17);
  image(SPOT, 345, 67, 19, 5);
  
  //image(WATER, 130, 511, 8, 9);
  //image(Defecation, 248, 509, 12, 12);
  
  textStyle(NORMAL);
  noStroke(); 
  
  if(video){
    image(video, 0, 246, 390, 239); 
  }
  
  for (let i = 0; i < detections.length; i++) {
    let object = detections[i];
    if (object.label === 'cat') {
      noFill();
      stroke(0, 255, 0); // Green box
      strokeWeight(2);
      rect(object.x, object.y+246, object.width, object.height);
      
      noStroke();
      //fill(0, 255, 0);
      //textSize(16);
      //text('Cat', object.x, object.y > 10 ? object.y - 5 : 10); // Label the box
    }
  }
  
  //if (showStats) {
   // fill(110, 133, 250);
    
   // text("(총: " + "0회," + " 총: " + "00:00)", 142, 519);
   // text("(총: " + "0회," + " 평균: " + "00:00)", 260, 519);
  //}
  
  if (selectedCatName) {
    //showStats = false;
    image(WATER, 130, 511, 8, 9);
    image(Defecation, 248, 509, 12, 12);
    // 선택된 고양이에 대해만 통계 표시
    displayCatStats(selectedCatName);
  }
  
  drawButtons(state);
  drawStatusBar(state);
  drawStateIndicator(state);
  
  if (isVideoPlaying) {
    image(videoElement, 0 , 246, 390, 239); // 비디오를 재생하는 위치와 크기
  }
  
  // 화장실+ 물 구역 그리기
  drawZones();
  
  textStyle(NORMAL);
  noStroke(); 
  
  // 고양이 객체 탐지 및 분류
  for (let i = 0; i < detectedObjects.length; i++) {
    let object = detectedObjects[i];
    
    if (object.label == 'cat') { // 이 부분 나중에 'cat'으로 수정할것
      // 고양이 영역 표시
      stroke(0, 255, 0);
      noFill();
      rect(object.x, object.y + 246 , object.width, object.height);

      
      catCenterX = object.x + (object.width/2);
      catCenterY = object.y + (object.height/2);
      // 고양이 이미지 영역을 잘라서 분류
      let catImg = video.get(object.x, object.y, object.width, object.height);
      classifier.classify(catImg, gotClassified);
    }
  }
  
  image(bar_background, 0, 749, 390, 95);
  image(home_icon, 45, 770, 53, 62);
  image(record_icon, 125, 770, 53, 62);
  image(cam_icon, 205, 770, 53, 62);
  image(mypage_icon, 285, 770, 53, 62);
  
  
  //율무/버터 각각 이미지 클릭했을 때 나오는 데이터
  if(selectedCatName == 'Yulmoo'){
    displayCatStats('Yulmoo');
    drawStoredImages('Yulmoo');
    drawStoredTexts('Yulmoo');
    drawStoredImages('Yulmoo');
  }else if(selectedCatName == 'Butter'){
    displayCatStats('Butter');
    drawStoredImages('Butter');
    drawStoredTexts('Butter');
    drawStoredImages('Butter');
  }
}

let yulmooWaterImages = []; // 율무 물 구역
let yulmooPoopImages = []; // 율무 화장실 구역
let butterWaterImages = []; // 버터 물 구역
let butterPoopImages = []; // 버터 화장실 구역


// 율무가 물 구역에 갔을 때 이미지 저장 (자유롭게 크기 조정)
function storeYulmooWaterImages() {
  yulmooWaterImages.push(resizedWaterEllipse);
  yulmooWaterImages.push(resizedStateWater);
  yulmooWaterImages.push(resizedYulmooContent);
  yulmooWaterImages.push(resizedVideoImage);
}

// 율무가 화장실 구역에 갔을 때 이미지 저장 (자유롭게 크기 조정)
function storeYulmooPoopImages() {
  yulmooPoopImages.push(resizedPoopEllipse);
  yulmooPoopImages.push(resizedStatePoop);
  yulmooPoopImages.push(resizedYulmooContent);
  yulmooPoopImages.push(resizedVideoImage); 
}

// 버터가 물 구역에 갔을 때 이미지 저장 (자유롭게 크기 조정)
function storeButterWaterImages() {
  butterWaterImages.push(resizedWaterEllipse);
  butterWaterImages.push(resizedStateWater);
  butterWaterImages.push(resizedButterContent);
  butterWaterImages.push(resizedVideoImage);  
}

// 버터가 화장실 구역에 갔을 때 이미지 저장 (자유롭게 크기 조정)
function storeButterPoopImages() {
  butterWaterImages.push(resizedPoopEllipse);
  butterWaterImages.push(resizedStatePoop);
  butterWaterImages.push(resizedButterContent);
  butterWaterImages.push(resizedVideoImage);  
}

let yOffsetYulmoo = 540;  // 율무 이미지 y축 
let yOffsetButter = 540;   // 버터 이미지 y축 

function drawStoredImages(catName) {
  let xOffset = 45; // 기본 x축 시작 위치
  let imageGapX = 40; // 일반 이미지 간 x축 간격
  let videoGapX = 90; // 비디오 이미지 간 x축 간격
  let contentGapX = 55; // content 이미지 간 x축 간격

  let defaultGapY = 60; // y축 간격
  let ellipseYOffset = 15; // ellipse 이미지 Y축 추가 위치
  let videoYOffset = 10; // video 이미지 Y축 추가 위치

  let groupY = catName == 'Yulmoo' ? yOffsetYulmoo : yOffsetButter; // 그룹별 y축 위치

  // 공통된 이미지 배치 함수
  function drawImages(imageArray, xOffset, groupY) {
    let currentXOffset, currentYOffset;
    let yOffsetForGroup = groupY;

    for (let i = 0; i < imageArray.length; i++) {
      let currentImage = imageArray[i];
      currentXOffset = xOffset;
      currentYOffset = yOffsetForGroup;

      // 각 이미지에 따른 X, Y 위치 설정
      if (currentImage === resizedVideoImage) {
        currentXOffset += (i % 4) * videoGapX;
        currentYOffset += videoYOffset;
      } else if (currentImage === resizedButterContent || currentImage === resizedYulmooContent) {
        currentXOffset += (i % 4) * contentGapX;
      } else if (currentImage === resizedWaterEllipse || currentImage === resizedPoopEllipse) {
        currentYOffset += ellipseYOffset;
      } else {
        currentXOffset += (i % 4) * imageGapX;
      }

      image(currentImage, currentXOffset, currentYOffset);
      if ((i + 1) % 4 === 0) {
        yOffsetForGroup += defaultGapY; // 4개 이미지마다 y축 간격 추가
      }
    }
  }

  // 이미지 그룹별 그리기
  if (catName == 'Yulmoo') {
    drawImages(yulmooWaterImages, xOffset, groupY);
    drawImages(yulmooPoopImages, xOffset, groupY);
  } else if (catName == 'Butter') {
    drawImages(butterWaterImages, xOffset, groupY);
    drawImages(butterPoopImages, xOffset, groupY);
  }
}

//=============================================================데이터(시간) 저장=============================================================
let yulmooTexts = []; // 율무 시간 저장
let butterTexts = []; // 버터 시간 저장

let yulmooYOffset = 580; // 초기 y축 위치 
let butterYOffset = 580; // 초기 y축 위치
let yulmooSetGap = 70; // y축 간격
let butterSetGap = 70; // y축 간격

// 텍스트 저장 함수
function storeText(TimecatName, textContent, x, y) {
  fill(95, 95, 95);
  textAlign(LEFT);
  textSize(12);
  if (TimecatName === 'Yulmoo') {
    yulmooTexts.push({ text: textContent, x: x, y: y });
  } else if (TimecatName === 'Butter') {
    butterTexts.push({ text: textContent, x: x, y: y });
  }
}

function drawStoredTexts(TimecatName) {
  fill(95, 95, 95);
  textAlign(LEFT);
  textSize(12);
  let textArray = TimecatName === 'Yulmoo' ? yulmooTexts : butterTexts;

  for (let t of textArray) {
    text(t.text, t.x, t.y); // 저장된 위치에 텍스트 출력
  }
}

//=============================================================DRAW=============================================================
/*
function classifyCat(img) {
  console.log("Classifying cat...");
  classifier.classify(img, gotClassified); // 이미지를 분류
}
*/

let catCenterX = 0;
let catCenterY = 0; 

let yulmoo_where = 0; // 0: out of litter/water, 1: litter, 2: water
let butter_where = 0; // 0: out of litter/water, 1: litter, 2: water

let yulmoo_whereP = 0; // 이전 프레임에서의 위치
let butter_whereP = 0; // 이전 프레임에서의 위치

let yulmoo_litter_count = 0;
let yulmoo_water_count = 0;

let butter_litter_count = 0;
let butter_water_count = 0;

let yulmoo_litter_time = 0; //in millis
let yulmoo_litter_staTime = 0;
let yulmoo_water_time = 0;
let yulmoo_water_staTime = 0;
let butter_litter_time = 0; //in millis
let butter_litter_staTime = 0;
let butter_water_time = 0;
let butter_water_staTime = 0;


function gotClassified(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  
  // '율무'와 '버터'로 분류된 결과 처리
  
    if (results[0].label == '율무') {
      print('율무가 왔음');
      
      yulmoo_whereP = yulmoo_where; //이전 프레임에서의 위치를 저장 해두고,
      yulmooIsWhere(catCenterX, catCenterY); //현재 프레임에서의 위치를 업데이트.
      
      print('X position: '+catCenterX+'    Y position: '+catCenterY);
      
      
      if((yulmoo_whereP == 0 || yulmoo_whereP == 2) && yulmoo_where == 1){ // 율무가 화장실로 들어감
        yulmoo_litter_staTime = millis();
        
        let entryTime = new Date(); // 현재 시간 저장
        let formattedTime = formatCurrentTime(entryTime); // '시:분' 형식
        storeText('Yulmoo', formattedTime, 33, yulmooYOffset);
        
        storeYulmooPoopImages(); // 율무가 화장실에 갔을 때 데이터 저장
      }else if(yulmoo_whereP == 1 && (yulmoo_where == 0 || yulmoo_where == 2)){ //율무가 화장실에서 나감
        
        let stayedTime = millis() - yulmoo_litter_staTime; // 이때 딱 머문 시간 계산
        let formattedDuration = formatDuration(stayedTime);
        storeText('Yulmoo', formattedDuration, 237, yulmooYOffset); 
        
        yulmoo_litter_time = yulmoo_litter_time + (millis() - yulmoo_litter_staTime); // 율무가 화장실에 머문 시간 누적. 500ms 제한 없음.
        yulmoo_litter_count = yulmoo_litter_count + 1; // 율무 화장실 간 횟수 1 증가
        
        yulmooYOffset += yulmooSetGap; 
      }
      
      if((yulmoo_whereP == 0 || yulmoo_whereP == 1) && yulmoo_where == 2){ // 율무가 물마시러 들어감
        yulmoo_water_staTime = millis();
        
        let entryTime = new Date(); // 현재 시간 저장
        let formattedTime = formatCurrentTime(entryTime); // '시:분' 형식
        storeText('Yulmoo', formattedTime, 33, yulmooYOffset);
        
        storeYulmooWaterImages(); // 율무가 물 구역에 갔을 때 데이터 저장
      }else if(yulmoo_whereP == 2 && (yulmoo_where == 0 || yulmoo_where == 1)){ //율무가 물마시다가 나감
        
        let stayedTime = millis() - yulmoo_water_staTime; // 이때 딱 머문 시간 계산
        let formattedDuration = formatDuration(stayedTime);
        storeText('Yulmoo', formattedDuration, 237, yulmooYOffset); 
        
        yulmoo_water_time = yulmoo_water_time + (millis() - yulmoo_water_staTime); // 율무가 물마신 시간 누적. 500ms 제한 없음.
        yulmoo_water_count = yulmoo_water_count + 1; // 율무 물마신 횟수 1 증가
        
        yulmooYOffset += yulmooSetGap; 
      }
      
      print('[Yulmoo]');
      print('화장실 횟수'+yulmoo_litter_count);
      print('화장실 시간(ms)'+yulmoo_litter_time);
      print('물마신 횟수'+yulmoo_water_count);
      print('물마신 시간(ms)'+yulmoo_water_time);
      
    } else if (results[0].label == '버터') {
      print('버터가 왔음');
      butter_whereP = butter_where;
      butterIsWhere(catCenterX, catCenterY);
      
      print('X position: '+catCenterX+'    Y position: '+catCenterY);
  
       if((butter_whereP == 0 || butter_whereP == 2) && butter_where == 1){ // 버터가 화장실로 들어감
        butter_litter_staTime = millis();
         
        let entryTime = new Date(); // 현재 시간 저장
        let formattedTime = formatCurrentTime(entryTime); // '시:분' 형식
        storeText('Butter', formattedTime, 33, butterYOffset);
         
         storeButterPoopImages(); // 버터가 화장실에 갔을 때 데이터 저장
      }else if(butter_whereP == 1 && (butter_where == 0 || butter_where == 2)){ //버터가 화장실에서 나감
        
        let stayedTime = millis() - butter_litter_staTime; // 이때 딱 머문 시간 계산
        let formattedDuration = formatDuration(stayedTime);
        storeText('Butter', formattedDuration, 237, butterYOffset); 
        
        butter_litter_time = butter_litter_time + (millis() - butter_litter_staTime); // 버터가 화장실에 머문 시간 누적. 500ms 제한 없음.
        butter_litter_count = butter_litter_count + 1; // 버터 화장실 간 횟수 1 증가
        
        butterYOffset += butterSetGap;
      }
      
      if((butter_whereP == 0 || butter_whereP == 1) && butter_where == 2){ // 버터가 물마시러 들어감
        butter_water_staTime = millis();
        
        let entryTime = new Date(); // 현재 시간 저장
        let formattedTime = formatCurrentTime(entryTime); // '시:분' 형식
        storeText('Butter', formattedTime, 33, butterYOffset);
        
        storeButterWaterImages(); // 버터가 물 구역에 갔을 때 데이터 저
      }else if(butter_whereP == 2 && (butter_where == 0 || butter_where == 1)){ //버터가 물마시다가 나감
        
        let stayedTime = millis() - butter_water_staTime; // 이때 딱 머문 시간 계산
        let formattedDuration = formatDuration(stayedTime);
        storeText('Butter', formattedDuration, 237, butterYOffset); 
        
        butter_water_time = butter_water_time + (millis() - butter_water_staTime); // 버터가 물마신 시간 누적. 500ms 제한 없음.
        butter_water_count = butter_water_count + 1; // 버터물마신 횟수 1 증가
        
        butterYOffset += butterSetGap;
      }
      
      print('[Butter]');
      print('화장실 횟수'+butter_litter_count);
      print('화장실 시간(ms)'+butter_litter_time);
      print('물마신 횟수'+butter_water_count);
      print('물마신 시간(ms)'+butter_water_time);
    }
  
}

function yulmooIsWhere(posX, posY){
  if(posX >= 0 && posX <= 145 && posY+246 >=245 && posY+246 <= 245+140){
    yulmoo_where = 1; 
  }else if(posX >= 245 && posX <= 245+145 && posY+246 >=245 && posY+246 <= 245+140){
    yulmoo_where = 1;
  }else if(posX >= 0 && posX <= 120 && posY+246 >= 390 && posY+246 <= 390+95){
    yulmoo_where = 2;
  }else{
    yulmoo_where = 0;
  }
}

function butterIsWhere(posX, posY){
  if(posX >= 0 && posX <= 145 && posY+246 >=245 && posY+246 <= 245+140){
    butter_where = 1; 
  }else if(posX >= 245 && posX <= 245+145 && posY+246 >=245 && posY+246 <= 245+140){
    butter_where = 1;
  }else if(posX >= 0 && posX <= 120 && posY+246 >= 390 && posY+246 <= 390+95){
    butter_where = 2;
  }else{
    butter_where = 0;
  }
}

// 시간 형식 변환 함수: 밀리초 -> '분:초'
function formatDuration(duration) {
  let seconds = Math.floor(duration / 1000); // 밀리초를 초로 변환
  let minutes = Math.floor(seconds / 60); // 초를 분으로 변환
  seconds = seconds % 60; // 나머지 초 계산

  // 0초일 경우 "00:00" 출력
  if (minutes === 0 && seconds === 0) {
    return "00:00";
  }

  // 두 자리 수로 출력
  let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  return formattedMinutes + ":" + formattedSeconds;
}


// 현재 시간 형식: '시:분'
function formatCurrentTime(date) {
  let hours = nf(date.getHours(), 2);   // 2자리로 표현
  let minutes = nf(date.getMinutes(), 2);
  return `${hours}:${minutes}`;
}


function mousePressed() {
  // 클릭한 위치가 비디오 이미지 영역 안에 있는지 확인
  if (mouseX > 230 && mouseX < 230 + 43 && mouseY > 550 && mouseY < 550 + 42) {
    if (!isVideoPlaying) {
      videoElement.play();  // 비디오 재생
      isVideoPlaying = true;  // 비디오가 재생 중임을 표시
    } else {
      videoElement.pause();  // 비디오 일시 정지
      isVideoPlaying = false;  // 비디오가 재생 중이지 않음을 표시
    }
  }
}

function isInWaterZone(x, y) {
  // 물 영역 조건
  return x > 100 && x < 200 && y > 300 && y < 400;
}

function isInToiletZone(x, y) {
  // 화장실 영역 조건
  return x > 300 && x < 400 && y > 300 && y < 400;
}

function drawZones() {
  // 화장실 1
  stroke(255, 0, 0);
  noFill();
  rect(litterBox1.x, litterBox1.y, litterBox1.width, litterBox1.height);
  fill(255, 0, 0);
  //textSize(16);
  //text("화장실 1", litterBox1.x + 5, litterBox1.y - 10);
  
  // 화장실 2
  stroke(0, 0, 255);
  noFill();
  rect(litterBox2.x, litterBox2.y, litterBox2.width, litterBox2.height);
  fill(0, 0, 255);
  //textSize(16);
  //text("화장실 2", litterBox2.x + 5, litterBox2.y - 10);
  
  // 물그릇
  stroke(0, 255, 0);
  noFill();
  rect(waterBowl.x, waterBowl.y, waterBowl.width, waterBowl.height);
  fill(0, 255, 0);
  //textSize(16);
  //text("물", waterBowl.x + 5, waterBowl.y - 10);
}

function millisToTimeString(milliseconds) {
  let totalSeconds = Math.floor(milliseconds / 1000); // 밀리초를 초로 변환
  let minutes = Math.floor(totalSeconds / 60); // 분 계산
  let seconds = totalSeconds % 60; // 초 계산
  return nf(minutes, 2) + ":" + nf(seconds, 2); // 두 자리로 맞추어 출력
}

function displayCatStats(tempCatName) {
  fill(110, 133, 250);
  textAlign(LEFT);
  textSize(12);
  if (tempCatName == 'Yulmoo') {
    // 율무 클릭 시 출력
    if (millis() - startTime < 13000) {
      // Show the first text before 10 seconds
        let displayWaterTime = yulmoo_water_time == 0 ? "00:00" : millisToTimeString(yulmoo_water_time);
        text("(총: " + yulmoo_water_count + " 회," + " 총: " + displayWaterTime + ")", 142, 519);
      let averageLitterBoxStayTime = yulmoo_litter_count == 0 ? 0
      : yulmoo_litter_time / yulmoo_litter_count;
      
    text("(총: " + yulmoo_litter_count + " 회," + " 평균: " + millisToTimeString(averageLitterBoxStayTime) + ")", 260, 519);
    } else{
        text("(총: " + 1 + " 회," + " 총: " + "00:10)", 142, 519);
        image(water_ellipse, 50, 553, 6, 6);
        image(state_water, 80, 540, 61, 59);
        image(yulmoo_content, 150, 540, 147, 59);
        image(Video_image, 310, 550, 43, 42);

        if (!timeDisplayed) {
          const currentTime = nf(hour(), 2, 0) + ':' + nf(minute(), 2, 0);
          displayedTime = currentTime;
          timeDisplayed = true;
        }

        fill(95, 95, 95);
        textAlign(LEFT);
        textSize(12);
        text(displayedTime, 38, 580); 
        text("00:10", 237, 579);  
        fill(110, 133, 250); 
      if (mouseX >= 310 && mouseX <= 360 && mouseY >= 550 && mouseY <= 600) {
      if (mouseIsPressed ) {
          isVideoPlaying=true;
          if(isVideoPlaying){
            image(video, 295, 600, 74, 52); 
            isVideoPlaying=false;
          }
        }
      }
      
      //if (mouseX >= 310 && mouseX <= 360 && mouseY >= 550 && mouseY <= 600) {
      //  if (mouseIsPressed) {
      //    videoLoaded();
      //  }
     // }
   }
   
    
    
   // let displayWaterTime = yulmoo_water_time == 0 ? "00:00" : millisToTimeString(yulmoo_water_time);
  //  text("(총: " + yulmoo_water_count + " 회," + " 총: " + displayWaterTime + ")", 142, 519);
    // 평균 시간이 NaN이 되지 않도록 처리
      let averageLitterBoxStayTime = yulmoo_litter_count == 0 ? 0
       : yulmoo_litter_time / yulmoo_litter_count;
      
      text("(총: " + yulmoo_litter_count + " 회," + " 평균: " + millisToTimeString(averageLitterBoxStayTime) + ")", 260, 519);
    
  } else if (tempCatName == 'Butter') {
    // 버터 클릭 시 출력
    let displayWaterTime = butter_water_time == 0 ? "00:00" : millisToTimeString(butter_water_time);
    text("(총: " + butter_water_count + " 회," + " 총: " + displayWaterTime + ")", 142, 519);
    
    // 평균 시간이 NaN이 되지 않도록 처리
    let averageLitterBoxStayTime = butter_litter_count == 0 ? 0
      : butter_litter_time / butter_litter_count ;
    
    text("(총: " + butter_litter_count + " 회," + " 평균: " + millisToTimeString(averageLitterBoxStayTime) + ")", 260, 519);
 }
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function drawVideoPreview(x, y, w, h){
  image(video, x, y, w, h);
  image(videoFrame, x, y, w, h);
}

function drawStateIndicator(currentState){
  image(stateIndicator[currentState], 140,389,105,37);
}

function drawButtons(currentState){
  let pause_stop_button_number = 0;
  if(currentState == 1){
    pause_stop_button_number = 1;
  }  
  image(btn_pause[pause_stop_button_number], 176, 431, 32, 32);
  image(btn_record[currentState], 132, 431, 32, 32);
  image(btn_stop[pause_stop_button_number], 220, 431, 32, 32);
}

function drawStatusBar(currentState){
  fill(0, 80);
  noStroke();
  rect(20,256,60,15,5);
  rect(85,256,50,15,5);
  rect(20,275,65,15,5);
  
  textFont('Inter');
  textSize(10);
  
  let currentTime = ''+nf(hour(),2,0)+':'+nf(minute(),2,0)+':'+nf(second(),2,0);
  let currentTime2 = ''+nf(hour(),2,0)+':'+nf(minute(),2,0);
  let currentDate = ''+year()+'.'+nf(month(),2,0)+'.'+nf(day(),2,0)+'.';
  let currentDay = new Date();
  let dayOfWeek = currentDay.toLocaleString('ko-KR', { weekday: 'long' });
  
  if(currentState == 0){
    noFill();
    stroke(255,200);
    strokeWeight(2);
    ellipse(30,283,6,6);
    fill(255,200);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 38, 286);
    textAlign(CENTER);
    text(currentTime, 110, 267);
    textAlign(LEFT);
    text(currentDate, 25, 267);
    fill(95, 95, 95);
    textAlign(LEFT);
    textSize(12);
    text(currentDate + ' ' + dayOfWeek, 23, 520);
    //text(currentTime2, 38, 575);
    fill(0);
  }else if(currentState == 1){
    fill(202,38,38);
    noStroke();
    ellipse(30,283,6,6);
    fill(202,38,38);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 38, 286);
    fill(255);
    textAlign(CENTER);
    text(currentTime, 110, 267);
    textAlign(LEFT);
    text(currentDate, 25, 267);
    fill(95, 95, 95);
    textAlign(LEFT);
    textSize(12);
    text(currentDate + ' ' + dayOfWeek, 23, 520);
    fill(0);
  }else if(currentState == 2){
    noFill();
    stroke(202,38,38);
    strokeWeight(2);
    ellipse(30,283,6,6);
    fill(202,38,38);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 38, 286);
    fill(255,153);
    textAlign(CENTER);
    text(currentTime, 110, 267);
    textAlign(LEFT);
    text(currentDate, 25, 267);
    fill(95, 95, 95);
    textAlign(LEFT);
    textSize(12);
    text(currentDate + ' ' + dayOfWeek, 23, 520);
    fill(0);
  }else if(currentState == 3){
    noFill();
    stroke(255,200);
    strokeWeight(2);
    ellipse(30,283,6,6);
    fill(255,200);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 38, 286);
    textAlign(CENTER);
    text(currentTime, 110, 267);
    textAlign(LEFT);
    text(currentDate, 25, 267);
    fill(95, 95, 95);
    textAlign(LEFT);
    textSize(12);
    text(currentDate + ' ' + dayOfWeek, 23, 520);
    fill(0);
  }
}

function mouseReleased(){
  if(state == 0){
    if(dist(mouseX, mouseY, 153, 452) <= 21){ // for Recording BTN
      state = 1; //go to 1.Recording Page from 0.Main Page.
      recordingStartTime = millis();
      //startLog();
      myVideoRec.startRec(); // start recording video
    }
  }else if(state == 1){
    if(dist(mouseX, mouseY, 198, 452) <= 14){ // for Pause BTN
      state = 2; //go to 2.Paused Page from 1.Recording Page.
      pausedStartTime = millis();
    }
    if(dist(mouseX, mouseY, 243, 452) <= 14){ // for Stop BTN
      state = 3; //go to 3.Saved Page from 1.Recording Page.
      initializeTimes();
      saveLog();
      myVideoRec.stopRec(); // stop and save the video
    }
  }else if(state == 2){
    if(dist(mouseX, mouseY, 153, 452) <= 21){ // for Recording BTN
      state = 1; //go to 1.Recording Page from 2.Paused Page.
      totalPausedTime = totalPausedTime + pausedTime;
    }
  }else if(state == 3){
    if(dist(mouseX, mouseY, 153, 452) <= 21){ // for Recording BTN
      state = 0; //go to 0.Main Page from 3.Saved Page.
    }
  }
}
function initializeTimes(){
  recordingStartTime = 0;
  pausedStartTime = 0;
  pausedTime = 0;
  totalPausedTime = 0;
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  detectedObjects = results;
  // 화면이 멈추지 않도록 감지 결과를 연속적으로 갱신
  detector.detect(video, gotDetections); // 비동기 감지 연속 처리
}