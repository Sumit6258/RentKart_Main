import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rental-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-10">

      <h1 class="text-3xl font-bold mb-2">Rental Terms & Conditions</h1>
      <p class="text-sm text-gray-500 mb-6">Last updated: {{ today | date:'longDate' }}</p>

      <p class="mb-6 text-gray-700">
        Welcome to <strong>Rentkart</strong>. By renting any product through our platform, you agree to the following Terms & Conditions.
        These terms apply to all products and categories listed on Rentkart.
      </p>

      <div class="space-y-6 text-gray-700 leading-relaxed">

        <section>
          <h2 class="font-semibold text-lg">1. Eligibility</h2>
          <ul class="list-disc ml-5">
            
            <li>A valid government ID may be required.</li>
            <li>Rentkart reserves the right to approve or reject rentals.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">2. Rental Period</h2>
          <ul class="list-disc ml-5">
            <li>Rental starts on delivery/start date.</li>
            <li>Ends on return/end date.</li>
            <li>Late returns may incur extra daily charges.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">3. Payments</h2>
          <ul class="list-disc ml-5">
            <li>Rental + refundable security deposit paid upfront.</li>
            <li>Prices include GST unless stated.</li>
            <li>Payments are processed securely.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">4. Security Deposit</h2>
          <ul class="list-disc ml-5">
            <li>Refunded within 3–7 business days after inspection.</li>
            <li>Deductions for damages, loss, or missing accessories.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">5. Product Usage</h2>

          <p class="mt-2">You agree to:</p>
          <ul class="list-disc ml-5">
            <li>Use responsibly</li>
            <li>Follow manufacturer guidelines</li>
            <li>Return in original condition</li>
          </ul>

          <p class="mt-2">You must NOT:</p>
          <ul class="list-disc ml-5">
            <li>Sub-rent products</li>
            <li>Modify or self-repair</li>
            <li>Use for illegal purposes</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">6. Damage / Loss Policy</h2>
          <ul class="list-disc ml-5">
            <li>Customer responsible for damage, missing parts, theft.</li>
            <li>Repair/replacement deducted from deposit.</li>
            <li>Extra charges apply if damage exceeds deposit.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">7. Cancellation Policy</h2>
          <ul class="list-disc ml-5">
            <li>Before dispatch: Full refund.</li>
            <li>After dispatch: Delivery fee may apply.</li>
            <li>No refund once rental begins.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">8. Delivery & Pickup</h2>
          <ul class="list-disc ml-5">
            <li>Free delivery & pickup where applicable.</li>
            <li>Customer must be present.</li>
            <li>Failed pickup attempts may incur charges.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">9. Extension of Rental</h2>
          <ul class="list-disc ml-5">
            <li>Request before end date.</li>
            <li>Subject to availability.</li>
            <li>Additional charges apply.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">10. Vendor Responsibility</h2>
          <ul class="list-disc ml-5">
            <li>Products are verified and functional.</li>
            <li>Descriptions must be accurate.</li>
            <li>Rentkart is a marketplace, not product owner.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">11. Platform Rights</h2>
          <ul class="list-disc ml-5">
            <li>Suspend accounts for misuse.</li>
            <li>Cancel rentals if fraud suspected.</li>
            <li>Modify terms anytime.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">12. Limitation of Liability</h2>
          <ul class="list-disc ml-5">
            <li>No liability for misuse injuries.</li>
            <li>No business loss liability.</li>
            <li>Maximum liability limited to rental amount.</li>
          </ul>
        </section>

        <section>
          <h2 class="font-semibold text-lg">13. Privacy</h2>
          <p>User data handled per Rentkart Privacy Policy.</p>
        </section>

        <section>
          <h2 class="font-semibold text-lg">14. Governing Law</h2>
          <p>Governed by Indian Law. Disputes under local jurisdiction.</p>
        </section>

        <section>
          <h2 class="font-semibold text-lg">15. Contact</h2>
          <p>📧 support&#64;rentkart.in</p>
          <p>🌐 www.rentkart.in</p>
        </section>

      </div>
    </div>
  `
})
export class RentalTermsComponent {
  today = new Date();
}
