'use client';
import React, { useState, useEffect } from 'react';
import { Eye, Heart, Lightbulb, Palette, TestTube, Users, ArrowRight, Check, X, AlertCircle, Info, BookOpen, Zap, Target, Globe } from 'lucide-react';
import Link from 'next/link';

const ColorBlindnessGuide = () => {
  const [testStep, setTestStep] = useState(0);
  const [testAnswers, setTestAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});

  const ishiharaTests = [
    { image: "🔴⚫🔴⚫🔴⚫🔴⚫", correctAnswer: "12", options: ["12", "13", "21", "I can't see any number"] },
    { image: "🟢⚫🟢⚫🟢⚫🟢⚫", correctAnswer: "8", options: ["8", "3", "5", "I can't see any number"] },
    { image: "🟡⚫🟡⚫🟡⚫🟡⚫", correctAnswer: "29", options: ["29", "70", "20", "I can't see any number"] },
    { image: "🔵⚫🔵⚫🔵⚫🔵⚫", correctAnswer: "57", options: ["57", "35", "75", "I can't see any number"] }
  ];

  const handleTestAnswer = (answer) => {
    const newAnswers = [...testAnswers, answer];
    setTestAnswers(newAnswers);
    
    if (testStep < ishiharaTests.length - 1) {
      setTestStep(testStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetTest = () => {
    setTestStep(0);
    setTestAnswers([]);
    setShowResults(false);
  };

  const getTestResult = () => {
    const correctAnswers = testAnswers.filter((answer, index) => 
      answer === ishiharaTests[index].correctAnswer
    ).length;
    
    if (correctAnswers === ishiharaTests.length) {
      return "Normal color vision - You likely have no color vision deficiency.";
    } else if (correctAnswers >= 2) {
      return "Possible mild color vision deficiency - Consider consulting an eye care professional.";
    } else {
      return "Possible color vision deficiency - We recommend consulting an eye care professional for proper testing.";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setVisibleSections(prev => ({
          ...prev,
          [section.dataset.section]: isVisible
        }));
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-teal-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Eye className="w-8 h-8 text-purple-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Color Vision Deficiency Guide
            </h1>
          </div>
          <p className="text-gray-600 mt-2">Comprehensive scientific resource for understanding color vision</p>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 mt-8 flex">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white text-lg rounded-lg shadow font-semibold hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-pink-200"
        >
          <span className="text-2xl">&#8592;</span> Back 
        </Link>
      </div>

      {/* Enhanced Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
              Understanding Color Vision Deficiency
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Color vision deficiency (CVD) affects approximately 300 million people worldwide. It's a genetic condition 
              that alters how the retina processes different wavelengths of light, resulting in difficulty distinguishing 
              certain colors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">8%</div>
              <div className="text-gray-600">of males worldwide</div>
              <div className="text-sm text-gray-500 mt-2">~1 in 12 men affected</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-pink-600 mb-2">0.5%</div>
              <div className="text-gray-600">of females worldwide</div>
              <div className="text-sm text-gray-500 mt-2">~1 in 200 women affected</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold text-indigo-600 mb-2">300M+</div>
              <div className="text-gray-600">people affected globally</div>
              <div className="text-sm text-gray-500 mt-2">Most common visual impairment</div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Enhanced Types Section with Horizontal Layout */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50" data-section="types">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Palette className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Types of Color Vision Deficiency</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              CVD is classified based on which cone photoreceptors are affected. Each type has distinct characteristics 
              and affects color perception differently.
            </p>
          </div>
          
          {/* Horizontal scrolling cards */}
          <div className="flex overflow-x-auto gap-8 pb-6" style={{ scrollBehavior: 'smooth' }}>
            {/* Protanopia */}
            <div 
              className="flex-none w-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-red-200 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl cursor-pointer"
              onMouseEnter={() => setHoveredCard('protanopia')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                <h3 className="text-2xl font-bold text-white mb-2">Protanopia</h3>
                <p className="text-red-100 mb-2">L-cone deficiency</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-red-100 text-sm">Missing long-wavelength photoreceptors</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Characteristics:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Difficulty distinguishing red from green</li>
                      <li>• Red appears as dark yellow/brown</li>
                      <li>• Affects 1% of males, 0.01% of females</li>
                      <li>• Deuteranopia often confused with this</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Wavelength Range:</strong> 564-580nm severely affected
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deuteranopia */}
            <div 
              className="flex-none w-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-green-200 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl cursor-pointer"
              onMouseEnter={() => setHoveredCard('deuteranopia')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                <h3 className="text-2xl font-bold text-white mb-2">Deuteranopia</h3>
                <p className="text-green-100 mb-2">M-cone deficiency</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-green-100 text-sm">Missing medium-wavelength photoreceptors</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Characteristics:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Most common form of CVD</li>
                      <li>• Green appears as yellow/brown</li>
                      <li>• Affects 1% of males, 0.01% of females</li>
                      <li>• Often hereditary through maternal line</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Wavelength Range:</strong> 534-545nm severely affected
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tritanopia */}
            <div 
              className="flex-none w-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-200 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl cursor-pointer"
              onMouseEnter={() => setHoveredCard('tritanopia')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                <h3 className="text-2xl font-bold text-white mb-2">Tritanopia</h3>
                <p className="text-blue-100 mb-2">S-cone deficiency</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-blue-100 text-sm">Missing short-wavelength photoreceptors</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Characteristics:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Rarest form of CVD</li>
                      <li>• Blue appears as green/gray</li>
                      <li>• Yellow appears as pink/red</li>
                      <li>• Affects 0.01% of population equally</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Wavelength Range:</strong> 420-440nm severely affected
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monochromacy */}
            <div 
              className="flex-none w-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl cursor-pointer"
              onMouseEnter={() => setHoveredCard('monochromacy')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-6 -translate-y-6"></div>
                <h3 className="text-2xl font-bold text-white mb-2">Monochromacy</h3>
                <p className="text-gray-100 mb-2">Complete color blindness</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-gray-100 text-sm">Absence of cone function</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Characteristics:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Extremely rare condition</li>
                      <li>• Only see in shades of gray</li>
                      <li>• Affects 0.00001% of population</li>
                      <li>• Often accompanied by vision problems</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-800">
                      <strong>Types:</strong> Rod monochromacy (Achromatopsia) and Blue cone monochromacy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Misconceptions Section */}
      <section className="py-16 px-4" data-section="misconceptions">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <AlertCircle className="w-12 h-12 text-orange-500 animate-pulse" />
              <h2 className="text-4xl font-bold text-gray-800">Common Misconceptions</h2>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Let's debunk widespread myths about color vision deficiency with scientific facts.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Misconception Cards */}
            <div className={`space-y-6 transform transition-all duration-1000 ${visibleSections.misconceptions ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Myth: Color blind people see in black and white</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Fact:</strong> 99.99% of people with CVD can see colors. They simply perceive certain colors differently. 
                      Complete color blindness (monochromacy) affects less than 0.00001% of the population.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Myth: Only men can be color blind</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Fact:</strong> While X-linked CVD is more common in males (8% vs 0.5% in females), 
                      women can and do have color vision deficiency. Additionally, tritanopia affects both sexes equally.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Myth: Color blindness can be cured</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Fact:</strong> Congenital CVD is a permanent genetic condition. While assistive technologies 
                      and colored filters can help, they don't restore normal color vision.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`space-y-6 transform transition-all duration-1000 ${visibleSections.misconceptions ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Myth: Color blind people can't drive safely</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Fact:</strong> Studies show no significant increase in traffic accidents among color blind drivers. 
                      Traffic lights are designed with positional cues, and most CVD individuals adapt well to driving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Myth: Color blindness affects intelligence</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Fact:</strong> CVD has no correlation with intelligence or cognitive abilities. Many successful 
                      professionals in various fields have color vision deficiency.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <X className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Myth: All color blind people see the same way</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Fact:</strong> CVD exists on a spectrum. Even within the same type, individuals may have 
                      varying degrees of color discrimination difficulty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Color Perception Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50" data-section="perception">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Target className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Color Perception Simulation</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Experience how different types of color vision deficiency affect perception of common colors.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-indigo-200">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Normal Vision */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Normal Vision</h3>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="h-16 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Red</span>
                  </div>
                  <div className="h-16 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Green</span>
                  </div>
                  <div className="h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Blue</span>
                  </div>
                  <div className="h-16 bg-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Yellow</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Normal trichromatic vision can distinguish approximately 10 million colors across the visible spectrum.
                </p>
              </div>
              
              {/* Protanopia Simulation */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Protanopia Simulation</h3>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="h-16 bg-yellow-700 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Red</span>
                  </div>
                  <div className="h-16 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Green</span>
                  </div>
                  <div className="h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Blue</span>
                  </div>
                  <div className="h-16 bg-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Yellow</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Red colors appear as dark yellow or brown due to missing L-cone photoreceptors.
                </p>
              </div>

              {/* Deuteranopia Simulation */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Deuteranopia Simulation</h3>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="h-16 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Red</span>
                  </div>
                  <div className="h-16 bg-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Green</span>
                  </div>
                  <div className="h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Blue</span>
                  </div>
                  <div className="h-16 bg-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">Yellow</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Green colors appear as yellow or brown due to missing M-cone photoreceptors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment and Management Section */}
      <section className="py-16 px-4" data-section="treatment">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Heart className="w-12 h-12 text-pink-600 animate-pulse" />
              <h2 className="text-4xl font-bold text-gray-800">Treatment & Management</h2>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Treatments */}
            <div className={`transform transition-all duration-1000 ${visibleSections.treatment ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
              <div className="bg-gradient-to-br from-pink-100 to-white rounded-2xl p-8 shadow-xl border border-pink-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Current Treatments</h3>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">EnChroma Glasses</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Specialized filters that enhance color discrimination for red-green CVD. 
                          Effectiveness varies by individual and CVD type.
                        </p>
                        <div className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded">
                          Clinical studies show 60-80% improvement in color discrimination tests
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Colored Contact Lenses</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          ChromaGen and similar tinted contacts can improve color perception 
                          in some individuals with CVD.
                        </p>
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          Requires proper fitting and may affect visual acuity
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Gene Therapy Research</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Experimental treatments using viral vectors to introduce functional 
                          opsin genes into cone cells.
                        </p>
                        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          Currently in clinical trials - promising early results
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Living with CVD */}
            <div className={`transform transition-all duration-1000 ${visibleSections.treatment ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Adaptive Strategies</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <ArrowRight className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Pattern Recognition</h4>
                      <p className="text-gray-600 text-sm">Learn to identify objects by shape, texture, and context rather than color alone.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <ArrowRight className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Brightness Differentiation</h4>
                      <p className="text-gray-600 text-sm">Use luminance differences to distinguish between similar colors.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <ArrowRight className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Digital Color Identifiers</h4>
                      <p className="text-gray-600 text-sm">Smartphone apps like ColorID, Seeing AI, and Be My Eyes for real-time color identification.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <ArrowRight className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Organizational Systems</h4>
                      <p className="text-gray-600 text-sm">Label and organize colored items systematically in wardrobe and workspace.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <ArrowRight className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Career Considerations</h4>
                      <p className="text-gray-600 text-sm">Most careers are accessible; some fields may require color vision testing (pilots, electricians).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility for Developers Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-50 to-purple-50" data-section="accessibility">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Users className="w-12 h-12 text-indigo-600 animate-bounce" />
              <h2 className="text-4xl font-bold text-gray-800">Designing for Accessibility</h2>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Universal design principles that make interfaces accessible to everyone, including those with color vision deficiency.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className={`transform transition-all duration-1000 ${visibleSections.accessibility ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-indigo-200 hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">WCAG Guidelines</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Color contrast ratio: 4.5:1 (AA) or 7:1 (AAA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Don't rely solely on color to convey information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Use patterns, icons, and text labels</span>
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <strong>Tools:</strong> WebAIM Contrast Checker, Stark, Colour Contrast Analyser
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`transform transition-all duration-1000 ${visibleSections.accessibility ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Color Choices</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Avoid red-green combinations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Use blue-orange or purple-yellow pairs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Test with colorblind simulators</span>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Safe Palettes:</strong> IBM Color Palette, Material Design Colors
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`transform transition-all duration-1000 ${visibleSections.accessibility ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '0.4s' }}>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-200 hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-6">
                  <TestTube className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Testing Methods</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Use CVD simulation tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Test with actual users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Automated accessibility testing</span>
                  </div>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-pink-800">
                    <strong>Simulators:</strong> Colorblinding, Sim Daltonism, Chrome DevTools
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Colour Vision Test Button at the end */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto flex justify-center items-center">
          <Link
            href="/test"
            className="px-8 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white text-2xl rounded-xl shadow-lg font-bold hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-pink-200"
          >
            Take the Interactive Colour Vision Test
          </Link>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-purple-400" />
                <h3 className="text-xl font-bold">CVD Guide</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Comprehensive educational resource for understanding color vision deficiency. 
                Based on current scientific research and clinical findings.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Important Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• American Academy of Ophthalmology</li>
                <li>• International Association of Color Vision Deficiency</li>
                <li>• National Eye Institute (NEI)</li>
                <li>• Color Vision Testing Guidelines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Professional Testing</h4>
              <p className="text-gray-400 text-sm mb-4">
                For accurate diagnosis, consult with:
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Optometrists</li>
                <li>• Ophthalmologists</li>
                <li>• Certified Vision Therapists</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              This educational guide is based on peer-reviewed research and clinical guidelines. 
              Always consult healthcare professionals for medical advice.
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Color Vision Deficiency Guide. Information accurate as of latest research findings.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ColorBlindnessGuide;