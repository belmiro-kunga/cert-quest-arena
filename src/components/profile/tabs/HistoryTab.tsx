
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HistoryTabProps {
  user: {
    examHistory: Array<{
      id: number;
      cert: string;
      date: string;
      score: number;
      result: string;
    }>;
    certificates: Array<{
      id: string;
      name: string;
      acquired: string;
    }>;
  };
}

const HistoryTab: React.FC<HistoryTabProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam History</CardTitle>
        <CardDescription>
          Track your progress on practice exams.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Completed Exams</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {user.examHistory.map((exam) => (
                  <tr key={exam.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exam.cert}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.score}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        exam.result === 'Passed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/results/${exam.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Earned Certificates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.certificates.length > 0 ? (
              user.certificates.map((cert) => (
                <div key={cert.id} className="border rounded-md p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-gray-500">Acquired on {cert.acquired}</p>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 bg-gray-50 rounded-md">
                <p className="text-gray-500">You don't have any certificates yet.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-4">
          <Button onClick={() => navigate('/certifications')}>
            View All Certifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
