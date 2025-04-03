import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// הגדרת סוגים
interface Patient {
  id: number;
  name: string;
  age: number;
  injury: string;
  lastVisit: string;
  nextVisit: string;
}

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  frequency: string;
}

interface RehabProgram {
  id: number;
  name: string;
  exercises: Exercise[];
}

interface ProgressDataPoint {
  שבוע: string;
  'אחוז ביצוע': number;
  'התמדה': number;
}

interface PatientProgram {
  patient: Patient;
  program: string;
  exercises: Exercise[];
}

// ניתוח נתונים עבור גרף התקדמות
const progressData: ProgressDataPoint[] = [
  { שבוע: '1', 'אחוז ביצוע': 65, 'התמדה': 70 },
  { שבוע: '2', 'אחוז ביצוע': 72, 'התמדה': 75 },
  { שבוע: '3', 'אחוז ביצוע': 78, 'התמדה': 80 },
  { שבוע: '4', 'אחוז ביצוע': 82, 'התמדה': 85 },
  { שבוע: '5', 'אחוז ביצוע': 85, 'התמדה': 82 },
  { שבוע: '6', 'אחוז ביצוע': 89, 'התמדה': 90 },
];

// נתוני דוגמה למטופלים
const patientsData: Patient[] = [
  { id: 1, name: 'ישראל ישראלי', age: 42, injury: 'כאב גב תחתון', lastVisit: '15/03/2025', nextVisit: '07/04/2025' },
  { id: 2, name: 'שרה כהן', age: 35, injury: 'פציעת ACL', lastVisit: '28/03/2025', nextVisit: '11/04/2025' },
  { id: 3, name: 'דוד לוי', age: 67, injury: 'החלפת מפרק ירך', lastVisit: '01/04/2025', nextVisit: '15/04/2025' },
  { id: 4, name: 'מיכל רביב', age: 29, injury: 'דלקת בגיד אכילס', lastVisit: '25/03/2025', nextVisit: '08/04/2025' },
  { id: 5, name: 'יעקב מזרחי', age: 54, injury: 'כתף קפואה', lastVisit: '30/03/2025', nextVisit: '13/04/2025' },
];

// נתוני דוגמה לתוכניות שיקום
const rehabilitationPrograms: RehabProgram[] = [
  { id: 1, name: 'שיקום כאב גב תחתון', 
    exercises: [
      { id: 1, name: 'מתיחות גב', sets: 3, reps: 10, frequency: 'יומי' },
      { id: 2, name: 'חיזוק שרירי בטן', sets: 3, reps: 15, frequency: 'יומי' },
      { id: 3, name: 'מתיחת פיריפורמיס', sets: 2, reps: 5, frequency: '3 פעמים בשבוע' }
    ]
  },
  { id: 2, name: 'שיקום פציעת ACL', 
    exercises: [
      { id: 1, name: 'הרמת רגל ישרה', sets: 3, reps: 12, frequency: 'יומי' },
      { id: 2, name: 'כפיפות ברך', sets: 3, reps: 15, frequency: 'יומי' },
      { id: 3, name: 'סקוואט חלקי', sets: 3, reps: 10, frequency: '3 פעמים בשבוע' }
    ]
  },
  { id: 3, name: 'שיקום החלפת מפרק ירך', 
    exercises: [
      { id: 1, name: 'הרמת אגן', sets: 2, reps: 8, frequency: 'יומי' },
      { id: 2, name: 'הרמת רגל לצד', sets: 2, reps: 10, frequency: 'יומי' },
      { id: 3, name: 'צעדים קטנים', sets: 3, reps: 5, frequency: '3 פעמים בשבוע' }
    ]
  },
  { id: 4, name: 'שיקום דלקת בגיד אכילס', 
    exercises: [
      { id: 1, name: 'מתיחות קרסול', sets: 3, reps: 15, frequency: 'יומי' },
      { id: 2, name: 'עמידה על קצות אצבעות', sets: 2, reps: 12, frequency: 'יומי' },
      { id: 3, name: 'מתיחת שוק', sets: 3, reps: 8, frequency: '3 פעמים בשבוע' }
    ]
  },
  { id: 5, name: 'שיקום כתף קפואה', 
    exercises: [
      { id: 1, name: 'סיבוב כתף חיצוני', sets: 2, reps: 10, frequency: 'יומי' },
      { id: 2, name: 'מתיחת כתף', sets: 3, reps: 5, frequency: 'יומי' },
      { id: 3, name: 'הרמת יד', sets: 2, reps: 8, frequency: '3 פעמים בשבוע' }
    ]
  },
];

const Dashboard: React.FC = () => {
  const [showProgramModal, setShowProgramModal] = useState<boolean>(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<RehabProgram | null>(null);
  const [patientProgram, setPatientProgram] = useState<PatientProgram | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // פתיחת מודל תוכנית שיקום
  const handleProgramClick = (patient: Patient): void => {
    setSelectedPatient(patient);
    setShowProgramModal(true);
    // מאתחל תוכנית שמתאימה לסוג הפציעה של המטופל
    const matchingProgram = rehabilitationPrograms.find(
      program => program.name.includes(patient.injury)
    );
    if (matchingProgram) {
      setSelectedProgram(matchingProgram);
      setExercises([...matchingProgram.exercises]);
    } else {
      setSelectedProgram(null);
      setExercises([]);
    }
  };

  // פתיחת מודל התקדמות
  const handleProgressClick = (patient: Patient): void => {
    setSelectedPatient(patient);
    setShowProgressModal(true);
  };

  // עדכון תרגיל
  const handleExerciseUpdate = (index: number, field: keyof Exercise, value: any): void => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  // הוספת תרגיל חדש
  const handleAddExercise = (): void => {
    const newExercise: Exercise = { 
      id: exercises.length + 1, 
      name: 'תרגיל חדש', 
      sets: 3, 
      reps: 10, 
      frequency: 'יומי' 
    };
    setExercises([...exercises, newExercise]);
  };

  // הסרת תרגיל
  const handleRemoveExercise = (index: number): void => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  // אישור תוכנית שיקום
  const handleConfirmProgram = (): void => {
    if (selectedPatient) {
      setPatientProgram({
        patient: selectedPatient,
        program: selectedProgram ? selectedProgram.name : "תוכנית מותאמת אישית",
        exercises: exercises
      });
      setShowProgramModal(false);
    }
  };

  // בחירת תוכנית שיקום מוכנה
  const handleProgramSelect = (program: RehabProgram): void => {
    setSelectedProgram(program);
    setExercises([...program.exercises]);
  };

  return (
    <div dir="rtl" className="bg-gray-100 min-h-screen p-6">
      <header className="bg-white shadow rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-800">דאשבורד פיזיותרפיה</h1>
      </header>

      {/* דאשבורד מטופלים */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">רשימת מטופלים</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right">שם</th>
                <th className="py-3 px-4 text-right">גיל</th>
                <th className="py-3 px-4 text-right">סוג פציעה</th>
                <th className="py-3 px-4 text-right">ביקור אחרון</th>
                <th className="py-3 px-4 text-right">ביקור הבא</th>
                <th className="py-3 px-4 text-center">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {patientsData.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.name}</td>
                  <td className="py-3 px-4">{patient.age}</td>
                  <td className="py-3 px-4">{patient.injury}</td>
                  <td className="py-3 px-4">{patient.lastVisit}</td>
                  <td className="py-3 px-4">{patient.nextVisit}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
                      onClick={() => handleProgramClick(patient)}
                    >
                      תוכנית שיקום
                    </button>
                    <button 
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleProgressClick(patient)}
                    >
                      מעקב התקדמות
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* מודל תוכנית שיקום */}
      {showProgramModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  תוכנית שיקום - {selectedPatient.name}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowProgramModal(false)}
                >
                  ✕
                </button>
              </div>

              {/* בחירת תוכנית שיקום */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">בחר תוכנית שיקום:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {rehabilitationPrograms.map(program => (
                    <div 
                      key={program.id} 
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedProgram && selectedProgram.id === program.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-blue-50'
                      }`}
                      onClick={() => handleProgramSelect(program)}
                    >
                      <h4 className="font-semibold text-blue-700">{program.name}</h4>
                      <p className="text-gray-600 text-sm">{program.exercises.length} תרגילים</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* רשימת תרגילים */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">תרגילים:</h3>
                {exercises.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-4 text-right">שם התרגיל</th>
                          <th className="py-2 px-4 text-right">סטים</th>
                          <th className="py-2 px-4 text-right">חזרות</th>
                          <th className="py-2 px-4 text-right">תדירות</th>
                          <th className="py-2 px-4 text-right">פעולות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercises.map((exercise, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-4">
                              <input 
                                type="text" 
                                className="w-full border-gray-300 rounded p-1"
                                value={exercise.name}
                                onChange={(e) => handleExerciseUpdate(index, 'name', e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input 
                                type="number" 
                                className="w-full border-gray-300 rounded p-1"
                                value={exercise.sets}
                                onChange={(e) => handleExerciseUpdate(index, 'sets', parseInt(e.target.value))}
                                min="1"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input 
                                type="number" 
                                className="w-full border-gray-300 rounded p-1"
                                value={exercise.reps}
                                onChange={(e) => handleExerciseUpdate(index, 'reps', parseInt(e.target.value))}
                                min="1"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <select 
                                className="w-full border-gray-300 rounded p-1"
                                value={exercise.frequency}
                                onChange={(e) => handleExerciseUpdate(index, 'frequency', e.target.value)}
                              >
                                <option value="יומי">יומי</option>
                                <option value="פעמיים בשבוע">פעמיים בשבוע</option>
                                <option value="3 פעמים בשבוע">3 פעמים בשבוע</option>
                                <option value="4 פעמים בשבוע">4 פעמים בשבוע</option>
                                <option value="5 פעמים בשבוע">5 פעמים בשבוע</option>
                              </select>
                            </td>
                            <td className="py-2 px-4">
                              <button 
                                className="text-red-500"
                                onClick={() => handleRemoveExercise(index)}
                              >
                                הסר
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">טרם נבחרו תרגילים</p>
                )}
                
                <button 
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleAddExercise}
                >
                  + הוסף תרגיל חדש
                </button>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-3"
                  onClick={() => setShowProgramModal(false)}
                >
                  ביטול
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleConfirmProgram}
                >
                  אשר תוכנית
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* מודל מעקב התקדמות */}
      {showProgressModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  מעקב התקדמות - {selectedPatient.name}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowProgressModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">התקדמות לאורך זמן</h3>
                <div className="border border-gray-200 rounded-lg p-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={progressData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="שבוע" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="אחוז ביצוע"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="התמדה"
                        stroke="#10B981"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">אחוז ביצוע ממוצע</h4>
                  <p className="text-2xl font-bold text-blue-700">78.5%</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">אחוז התמדה</h4>
                  <p className="text-2xl font-bold text-green-600">80.3%</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">שיפור כולל</h4>
                  <p className="text-2xl font-bold text-purple-600">+24%</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">פירוט ביצוע לפי תרגילים</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-4 text-right">שם התרגיל</th>
                        <th className="py-2 px-4 text-center">אחוז ביצוע</th>
                        <th className="py-2 px-4 text-center">התמדה</th>
                        <th className="py-2 px-4 text-center">מגמה</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4">מתיחות גב</td>
                        <td className="py-2 px-4 text-center">82%</td>
                        <td className="py-2 px-4 text-center">90%</td>
                        <td className="py-2 px-4 text-center text-green-600">↑</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">חיזוק שרירי בטן</td>
                        <td className="py-2 px-4 text-center">75%</td>
                        <td className="py-2 px-4 text-center">85%</td>
                        <td className="py-2 px-4 text-center text-yellow-600">→</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">מתיחת פיריפורמיס</td>
                        <td className="py-2 px-4 text-center">68%</td>
                        <td className="py-2 px-4 text-center">75%</td>
                        <td className="py-2 px-4 text-center text-green-600">↑</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">הערות והמלצות</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="mb-2">• המטופל מראה התקדמות עקבית בביצוע התרגילים</p>
                  <p className="mb-2">• יש שיפור משמעותי במתיחות גב</p>
                  <p className="mb-2">• מומלץ להגביר את עצימות התרגילים החל מהשבוע הבא</p>
                  <p>• יש להקפיד על מנוחה נאותה בין אימונים</p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowProgressModal(false)}
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
