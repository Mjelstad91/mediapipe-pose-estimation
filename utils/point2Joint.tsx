const point2Joint = (i: number) => {
  switch (i) {
    case 0:
      return 'NOSE';
    case 1:
      return 'LEFT_EYE_INNER';
    case 2:
      return 'LEFT_EYE';
    case 3:
      return 'LEFT_EYE_OUTER';
    case 4:
      return 'RIGHT_EYE_INNER';
    case 5:
      return 'RIGHT_EYE';
    case 6:
      return 'RIGHT_EYE_OUTER';
    case 7:
      return 'LEFT_EAR';
    case 8:
      return 'RIGHT_EAR';
    case 9:
      return 'MOUTH_LEFT';
    case 10:
      return 'MOUTH_RIGHT';
    case 11:
      return 'LEFT_SHOULDER';
    case 12:
      return 'RIGHT_SHOULDER';
    case 13:
      return 'LEFT_ELBOW';
    case 14:
      return 'RIGHT_ELBOW';
    case 15:
      return 'LEFT_WRIST';
    case 16:
      return 'RIGHT_WRIST';
    case 17:
      return 'LEFT_PINKY';
    case 18:
      return 'RIGHT_PINKY';
    case 19:
      return 'LEFT_INDEX';
    case 20:
      return 'RIGHT_INDEX';
    case 21:
      return 'LEFT_THUMB';
    case 22:
      return 'RIGHT_THUMB';
    case 23:
      return 'LEFT_HIP';
    case 24:
      return 'RIGHT_HIP';
    case 25:
      return 'LEFT_KNEE';
    case 26:
      return 'RIGHT_KNEE';
    case 27:
      return 'LEFT_ANKLE';
    case 28:
      return 'RIGHT_ANKLE';
    case 29:
      return 'LEFT_HEEL';
    case 30:
      return 'RIGHT_HEEL';
    case 31:
      return 'LEFT_FOOT_INDEX';
    case 32:
      return 'RIGHT_FOOT_INDEX';
    default:
      return 'What is this?';
  }
};
export default point2Joint;
