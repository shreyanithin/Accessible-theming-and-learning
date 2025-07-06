'use client';
import React, { useState, useEffect } from 'react';
import { Eye, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const ColorBlindnessTest = () => {
  const [currentTest, setCurrentTest] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  // Test plates data (simplified Ishihara-style patterns)
  const testPlates = [
    {
      id: 1,
      correctAnswer: '12',
      options: ['12', '21', '71', '17'],
      difficulty: 'easy',
      colorType: 'normal',
      description: 'Normal vision test'
    },
    {
      id: 2,
      correctAnswer: '8',
      options: ['8', '3', '6', '9'],
      difficulty: 'medium',
      colorType: 'protanopia',
      description: 'Red-green color blindness (Protanopia)'
    },
    {
      id: 3,
      correctAnswer: '29',
      options: ['29', '70', '20', '79'],
      difficulty: 'medium',
      colorType: 'deuteranopia',
      description: 'Red-green color blindness (Deuteranopia)'
    },
    {
      id: 4,
      correctAnswer: '5',
      options: ['5', '2', '8', '6'],
      difficulty: 'hard',
      colorType: 'tritanopia',
      description: 'Blue-yellow color blindness (Tritanopia)'
    },
    {
      id: 5,
      correctAnswer: '42',
      options: ['42', '24', '74', '47'],
      difficulty: 'hard',
      colorType: 'monochromacy',
      description: 'Complete color blindness test'
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimeout = () => {
    setIsActive(false);
    if (currentTest < testPlates.length - 1) {
      setCurrentTest(prev => prev + 1);
      setTimeLeft(10);
    } else {
      setShowResults(true);
    }
  };

  const startTest = () => {
    setIsActive(true);
    setCurrentTest(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(10);
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({ ...prev, [currentTest]: answer }));
    setIsActive(false);
    
    setTimeout(() => {
      if (currentTest < testPlates.length - 1) {
        setCurrentTest(prev => prev + 1);
        setTimeLeft(10);
        setIsActive(true);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  const resetTest = () => {
    setCurrentTest(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(10);
    setIsActive(false);
  };

  const calculateResults = () => {
    const correctAnswers = testPlates.filter(plate => 
      answers[testPlates.indexOf(plate)] === plate.correctAnswer
    ).length;
    
    const accuracy = (correctAnswers / testPlates.length) * 100;
    
    let diagnosis = 'Normal Color Vision';
    if (accuracy < 40) {
      diagnosis = 'Severe Color Vision Deficiency';
    } else if (accuracy < 70) {
      diagnosis = 'Moderate Color Vision Deficiency';
    } else if (accuracy < 90) {
      diagnosis = 'Mild Color Vision Deficiency';
    }
    
    return { correctAnswers, accuracy, diagnosis };
  };

  const generateTestPlate = (plateId) => {
    // Generate SVG pattern for color blindness test
    const dots = [];
    const plateSize = 200;
    const centerX = plateSize / 2;
    const centerY = plateSize / 2;
    
    // Background dots
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * (plateSize / 2 - 20) + 10;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const size = Math.random() * 8 + 4;
      
      let color = '#90EE90'; // Light green
      if (Math.random() > 0.5) {
        color = '#FFB6C1'; // Light pink
      }
      
      dots.push(
        <circle
          key={`bg-${i}`}
          cx={x}
          cy={y}
          r={size}
          fill={color}
          opacity={0.8}
        />
      );
    }
    
    // Number pattern dots
    const numberPaths = getNumberPath(testPlates[plateId].correctAnswer);
    numberPaths.forEach((path, idx) => {
      const color = plateId % 2 === 0 ? '#FF6B6B' : '#4ECDC4';
      dots.push(
        <circle
          key={`num-${idx}`}
          cx={path.x}
          cy={path.y}
          r={path.r}
          fill={color}
          opacity={0.9}
        />
      );
    });
    
    return dots;
  };

  const getNumberPath = (number) => {
    const paths = [];
    const baseX = 100;
    const baseY = 100;
    
    // Simplified number patterns
    if (number === '12') {
      // Pattern for 1
      for (let i = 0; i < 20; i++) {
        paths.push({
          x: baseX - 20 + Math.random() * 10,
          y: baseY - 30 + i * 3,
          r: 4 + Math.random() * 2
        });
      }
      // Pattern for 2
      for (let i = 0; i < 25; i++) {
        const t = i / 25;
        paths.push({
          x: baseX + 10 + t * 20,
          y: baseY - 20 + Math.sin(t * Math.PI) * 15,
          r: 3 + Math.random() * 2
        });
      }
    } else if (number === '8') {
      // Pattern for 8
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * 2 * Math.PI;
        const radius = 15 + Math.sin(angle * 2) * 5;
        paths.push({
          x: baseX + radius * Math.cos(angle),
          y: baseY + radius * Math.sin(angle),
          r: 3 + Math.random() * 2
        });
      }
    } else {
      // Generic pattern
      for (let i = 0; i < 20; i++) {
        paths.push({
          x: baseX + (Math.random() - 0.5) * 40,
          y: baseY + (Math.random() - 0.5) * 40,
          r: 3 + Math.random() * 2
        });
      }
    }
    
    return paths;
  };

  const results = showResults ? calculateResults() : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Eye className="w-10 h-10 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">Color Vision Test</h1>
        </div>
        <p className="text-gray-600 text-lg">Test your color vision with this interactive assessment</p>
      </div>

      {!isActive && !showResults && (
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Instructions</h2>
            <div className="text-left space-y-3 text-gray-600">
              <p>• Look at each test plate carefully</p>
              <p>• Identify the number you see</p>
              <p>• You have 10 seconds per plate</p>
              <p>• Click your answer from the options</p>
              <p>• Complete all 5 test plates</p>
            </div>
            <button
              onClick={startTest}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Start Test
            </button>
          </div>
        </div>
      )}

      {isActive && !showResults && (
        <div className="text-center">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                Test {currentTest + 1} of {testPlates.length}
              </span>
              <span className="text-lg font-semibold text-red-600">
                {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((currentTest + 1) / testPlates.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              What number do you see?
            </h3>
            
            <div className="flex justify-center mb-6">
              <svg width="200" height="200" className="border-2 border-gray-200 rounded-full">
                {generateTestPlate(currentTest)}
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {testPlates[currentTest].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="bg-gray-100 hover:bg-blue-100 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-blue-300"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Test Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {results.correctAnswers}/{testPlates.length}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {results.accuracy.toFixed(1)}%
                </div>
                <div className="text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-semibold mb-2 ${
                  results.accuracy >= 90 ? 'text-green-600' : 
                  results.accuracy >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {results.diagnosis}
                </div>
                <div className="text-gray-600">Assessment</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Answer Review</h3>
              <div className="space-y-2">
                {testPlates.map((plate, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Test {idx + 1}</span>
                    <span className="text-gray-600">Correct: {plate.correctAnswer}</span>
                    <span className="text-gray-600">Your answer: {answers[idx] || 'No answer'}</span>
                    {answers[idx] === plate.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-6 p-4 bg-yellow-50 rounded-lg">
              <p className="font-semibold mb-2">Important Notice:</p>
              <p>This is a screening tool only. For accurate diagnosis and professional advice, please consult an optometrist or ophthalmologist.</p>
            </div>

            <button
              onClick={resetTest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center mx-auto"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Take Test Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorBlindnessTest;