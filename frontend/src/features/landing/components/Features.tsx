import React from 'react';
import { Cpu, Shield, Zap, Globe, BarChart3, MessageSquare } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features: React.FC = () => {
  const features = [
    {
      icon: Cpu,
      title: "Neural Core Engine",
      description: "Advanced AI algorithms processing data with sub-millisecond latency for real-time insights."
    },
    {
      icon: Shield,
      title: "Quantum Security",
      description: "End-to-end encryption protocols ensuring your data remains impenetrable to external threats."
    },
    {
      icon: Zap,
      title: "Dynamic Automation",
      description: "Smart workflows that adapt to your behavioral patterns, optimizing every task automatically."
    },
    {
      icon: Globe,
      title: "Global Sync",
      description: "Seamless synchronization across all decentralized nodes, keeping your system updated everywhere."
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 uppercase">
            System <span className="text-cyan-500">Modules</span>
          </h2>
          <div className="w-20 h-1 bg-cyan-600 mx-auto rounded-full" />
          <p className="mt-8 text-slate-400 max-w-2xl mx-auto font-medium">
            Deploy cutting-edge AI capabilities across your entire digital environment with our modular architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
