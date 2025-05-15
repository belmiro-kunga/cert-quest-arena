import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PacotesList from '@/components/pacote/PacotesList';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

const Pacotes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Extrair a categoria da URL, se existir
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    setSelectedCategory(category);
  }, [location.search]);

  const handleCategoryChange = (category: string | null) => {
    if (category) {
      navigate(`/pacotes?category=${category}`);
    } else {
      navigate('/pacotes');
    }
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Banner principal */}
        <section className="bg-gradient-to-r from-purple-700 to-purple-900 py-16 text-white">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Pacotes de Simulados</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Economize 25% ao adquirir pacotes de simulados da mesma certificação.
              Prepare-se para sua certificação com nossos pacotes completos.
            </p>
          </div>
        </section>

        {/* Filtros de categoria */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant={!selectedCategory ? "default" : "outline"} 
                className={`rounded-full px-6 py-2 ${!selectedCategory ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-purple-500 hover:bg-purple-100 text-purple-700'} font-medium`}
                onClick={() => handleCategoryChange(null)}
              >
                Todos os Pacotes
              </Button>
              <Button 
                variant={selectedCategory === 'aws' ? "default" : "outline"} 
                className={`rounded-full px-6 py-2 ${selectedCategory === 'aws' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-purple-500 hover:bg-purple-100 text-purple-700'} font-medium`}
                onClick={() => handleCategoryChange('aws')}
              >
                AWS
              </Button>
              <Button 
                variant={selectedCategory === 'azure' ? "default" : "outline"} 
                className={`rounded-full px-6 py-2 ${selectedCategory === 'azure' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-purple-500 hover:bg-purple-100 text-purple-700'} font-medium`}
                onClick={() => handleCategoryChange('azure')}
              >
                Microsoft Azure
              </Button>
              <Button 
                variant={selectedCategory === 'gcp' ? "default" : "outline"} 
                className={`rounded-full px-6 py-2 ${selectedCategory === 'gcp' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-purple-500 hover:bg-purple-100 text-purple-700'} font-medium`}
                onClick={() => handleCategoryChange('gcp')}
              >
                Google Cloud
              </Button>
              <Button 
                variant={selectedCategory === 'comptia' ? "default" : "outline"} 
                className={`rounded-full px-6 py-2 ${selectedCategory === 'comptia' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-purple-500 hover:bg-purple-100 text-purple-700'} font-medium`}
                onClick={() => handleCategoryChange('comptia')}
              >
                CompTIA
              </Button>
              <Button 
                variant={selectedCategory === 'cisco' ? "default" : "outline"} 
                className={`rounded-full px-6 py-2 ${selectedCategory === 'cisco' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-purple-500 hover:bg-purple-100 text-purple-700'} font-medium`}
                onClick={() => handleCategoryChange('cisco')}
              >
                Cisco
              </Button>
            </div>
          </div>
        </section>

        {/* Lista de pacotes */}
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <PacotesList categoria={selectedCategory || undefined} />
          </div>
        </section>

        {/* Seção de informações sobre os pacotes */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-purple-700">Por que escolher nossos pacotes?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <span className="text-purple-700 text-xl font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Economia garantida</h3>
                      <p className="text-gray-600">
                        Economize 25% ao adquirir simulados em pacotes, comparado à compra individual.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <span className="text-purple-700 text-xl font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Preparação completa</h3>
                      <p className="text-gray-600">
                        Nossos pacotes incluem simulados de diferentes níveis de dificuldade para uma preparação abrangente.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <span className="text-purple-700 text-xl font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Acesso permanente</h3>
                      <p className="text-gray-600">
                        Após a compra, você terá acesso permanente a todos os simulados incluídos no pacote.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-purple-700">Perguntas Frequentes</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Como funciona o desconto?</h4>
                    <p className="text-gray-600">
                      Todos os pacotes oferecem 25% de desconto em relação ao preço total dos simulados individuais.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Posso comprar simulados individualmente?</h4>
                    <p className="text-gray-600">
                      Sim, você pode comprar simulados individualmente, mas economizará ao optar pelos pacotes.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Os pacotes são atualizados?</h4>
                    <p className="text-gray-600">
                      Sim, nossos pacotes são atualizados regularmente para refletir as mudanças nas certificações.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pacotes;
