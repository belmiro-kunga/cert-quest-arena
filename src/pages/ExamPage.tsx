import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import ShoppingCartComponent from '@/components/ShoppingCart';

const ExamPage: React.FC = () => {
  const { examId } = useParams();
  const { addItem, items, isOpen, closeCart, removeItem } = useCart();

  // Simulated exam data
  const exam = {
    id: examId || '1',
    title: 'AWS Solutions Architect Associate',
    description: 'Complete practice exam with detailed explanations',
    fullDescription: 'Prepare for the AWS Solutions Architect Associate certification with our comprehensive practice exam. Includes detailed explanations for each question and performance analytics.',
    price: 29.99,
    discountPrice: 19.99,
    discountPercentage: 33,
    questionsCount: 65,
    duration: 130,
    topics: [
      'Amazon EC2 and EBS',
      'Amazon S3 and Glacier',
      'Amazon VPC',
      'AWS IAM',
      'High Availability and Scalability',
      'Security and Compliance'
    ],
    features: [
      'Timed exam simulation',
      'Detailed explanations for each question',
      'Performance analytics by domain',
      'Score prediction',
      'Unlimited retakes for 30 days'
    ]
  };

  const handleAddToCart = () => {
    addItem({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      price: exam.price,
      discountPrice: exam.discountPrice
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Exam Details */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{exam.title}</CardTitle>
                  <CardDescription>{exam.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{exam.fullDescription}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <div className="text-lg font-bold">{exam.questionsCount}</div>
                      <div className="text-sm text-gray-600">Questions</div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <div className="text-lg font-bold">{exam.duration} min</div>
                      <div className="text-sm text-gray-600">Duration</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Topics Covered</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {exam.topics.map((topic, index) => (
                          <li key={index}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Features</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {exam.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Purchase Card */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    {exam.discountPrice ? (
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">${exam.discountPrice}</div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg text-gray-500 line-through">${exam.price}</span>
                          <span className="text-sm text-green-600">Save {exam.discountPercentage}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold">${exam.price}</div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-cert-blue hover:bg-cert-blue/90"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <div className="text-center text-sm text-gray-500">
                      30-day access • Unlimited attempts
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <ShoppingCartComponent
        items={items}
        isOpen={isOpen}
        onClose={closeCart}
        onRemoveItem={removeItem}
      />
      <Footer />
    </div>
  );
};

export default ExamPage;
