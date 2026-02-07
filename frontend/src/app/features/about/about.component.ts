import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-black mb-6">About Rentkart</h1>
          <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            India's fastest-growing rental marketplace connecting customers with verified vendors
          </p>
        </div>
      </section>

      <!-- Mission Section -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="text-center mb-16">
              <h2 class="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p class="text-xl text-gray-600 leading-relaxed">
                To make renting as easy as buying by creating a trusted marketplace where anyone can 
                rent anything they need, from cameras to furniture, bikes to appliances - all at affordable prices.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                <div class="text-5xl mb-4">🎯</div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
                <p class="text-gray-600">Making premium products accessible to everyone through affordable rentals</p>
              </div>

              <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                <div class="text-5xl mb-4">🤝</div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Trust</h3>
                <p class="text-gray-600">Building trust through verified vendors and secure payment systems</p>
              </div>

              <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                <div class="text-5xl mb-4">🌱</div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
                <p class="text-gray-600">Promoting sustainable consumption by reducing waste through sharing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Story Section -->
      <section class="py-20 bg-white">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                Rentkart was founded in 2024 with a simple vision: to make quality products accessible to everyone, 
                regardless of their budget. We recognized that many people need items temporarily - whether it's a 
                camera for a weekend trip, furniture for a short-term rental, or equipment for a one-time project.
              </p>
              <p>
                Starting in Mumbai, we've grown to serve customers across India, connecting them with verified vendors 
                who offer everything from electronics to vehicles. Our platform ensures secure transactions, quality 
                products, and excellent customer service.
              </p>
              <p>
                Today, Rentkart has facilitated thousands of rentals, helping customers save money while giving vendors 
                an opportunity to earn from their idle assets. We're not just a rental platform - we're building a 
                community based on trust, sustainability, and shared prosperity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Values -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
            
            <div class="space-y-6">
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-l-4 border-blue-600">
                <h3 class="text-2xl font-bold text-gray-900 mb-3">🔒 Security First</h3>
                <p class="text-gray-700">Every transaction is protected. We verify all vendors and ensure secure payments.</p>
              </div>

              <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-l-4 border-purple-600">
                <h3 class="text-2xl font-bold text-gray-900 mb-3">💯 Quality Assured</h3>
                <p class="text-gray-700">All products are inspected and maintained to ensure the best rental experience.</p>
              </div>

              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-l-4 border-green-600">
                <h3 class="text-2xl font-bold text-gray-900 mb-3">🚀 Innovation Driven</h3>
                <p class="text-gray-700">We continuously improve our platform with the latest technology and user feedback.</p>
              </div>

              <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-l-4 border-yellow-600">
                <h3 class="text-2xl font-bold text-gray-900 mb-3">🤗 Customer Centric</h3>
                <p class="text-gray-700">Your satisfaction is our priority. 24/7 support to help you whenever you need.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-4xl font-bold mb-6">Join the Rentkart Community</h2>
          <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Whether you want to rent products or become a vendor, we're here to help you succeed
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/auth/register" 
               class="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-2xl">
              Get Started
            </a>
            <a routerLink="/products" 
               class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition">
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class AboutComponent {}
