/**
 * Google Analytics 4 Event Tracking
 * Icalia Labs - G-MSFD00QMYY
 *
 * Tracks:
 * - Contact form interactions and submissions
 * - CTA button clicks
 * - Navigation interactions
 * - External link clicks
 * - Scroll depth engagement
 */

// Ensure gtag is available
if (typeof gtag !== 'undefined') {

  // ========================================
  // 1. FORM TRACKING - Contact Form
  // ========================================

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {

    // Track form field focus (engagement signal)
    ['name', 'email', 'company', 'message'].forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('focus', function() {
          gtag('event', 'form_field_focus', {
            'form_name': 'contact_form',
            'field_name': fieldId,
            'timestamp': new Date().getTime()
          });
        });

        // Track form field blur (field completion)
        field.addEventListener('blur', function() {
          gtag('event', 'form_field_blur', {
            'form_name': 'contact_form',
            'field_name': fieldId,
            'field_value_length': this.value.length,
            'completed': this.value.length > 0
          });
        });
      }
    });

    // Track form submission attempt
    contactForm.addEventListener('submit', function(e) {
      gtag('event', 'form_submit_attempt', {
        'form_name': 'contact_form',
        'timestamp': new Date().getTime()
      });
    });
  }

  // Track form submission success (enhance existing form handler)
  const observeFormSuccess = setInterval(function() {
    const successBtn = document.getElementById('contact-submit-btn');
    if (successBtn && successBtn.classList.contains('btn-success')) {
      gtag('event', 'form_submit', {
        'form_name': 'contact_form',
        'form_status': 'success',
        'timestamp': new Date().getTime()
      });
      clearInterval(observeFormSuccess);
    }
  }, 500);

  // Track form submission error
  const observeFormError = setInterval(function() {
    const errorBtn = document.getElementById('contact-submit-btn');
    if (errorBtn && errorBtn.classList.contains('btn-error')) {
      gtag('event', 'form_submit', {
        'form_name': 'contact_form',
        'form_status': 'error',
        'button_text': errorBtn.textContent,
        'timestamp': new Date().getTime()
      });
      clearInterval(observeFormError);
    }
  }, 500);

  // ========================================
  // 2. CTA BUTTON TRACKING
  // ========================================

  // Track "Book a Call" buttons
  document.querySelectorAll('a[href*="calendly"], a[href="#book"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      gtag('event', 'cta_button_click', {
        'button_text': this.textContent.trim(),
        'button_url': this.href,
        'page_title': document.title,
        'page_path': window.location.pathname,
        'cta_type': this.href.includes('calendly') ? 'calendly_direct' : 'book_section'
      });
    });
  });

  // Track "Schedule a Call" primary CTA
  const scheduleBtn = document.querySelector('a[href*="calendly.com"]');
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', function() {
      gtag('event', 'schedule_call_click', {
        'button_location': 'contact_page_primary',
        'page_title': document.title
      });
    });
  }

  // ========================================
  // 3. NAVIGATION TRACKING
  // ========================================

  // Track industries dropdown opens (desktop)
  const industriesDropdown = document.querySelector('.industries-dropdown button');
  if (industriesDropdown) {
    let dropdownOpen = false;
    industriesDropdown.addEventListener('click', function() {
      dropdownOpen = !dropdownOpen;
      gtag('event', 'industries_dropdown', {
        'action': dropdownOpen ? 'opened' : 'closed',
        'menu_type': 'desktop',
        'page_path': window.location.pathname
      });
    });
  }

  // Track industry page clicks from dropdown
  document.querySelectorAll('.industries-dropdown a[href*="industries/"]').forEach(link => {
    link.addEventListener('click', function() {
      const industryName = this.querySelector('.font-semibold')?.textContent.trim() || this.textContent.trim();
      gtag('event', 'industry_link_click', {
        'industry': industryName,
        'source': 'desktop_dropdown',
        'page_path': window.location.pathname
      });
    });
  });

  // Track mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    let mobileMenuOpen = false;
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenuOpen = !mobileMenuOpen;
      gtag('event', 'mobile_menu_toggle', {
        'action': mobileMenuOpen ? 'opened' : 'closed',
        'page_path': window.location.pathname
      });
    });
  }

  // Track mobile industries menu toggle
  const mobileIndustriesToggle = document.getElementById('mobile-industries-toggle');
  if (mobileIndustriesToggle) {
    let mobileIndustriesOpen = false;
    mobileIndustriesToggle.addEventListener('click', function() {
      mobileIndustriesOpen = !mobileIndustriesOpen;
      gtag('event', 'mobile_industries_toggle', {
        'action': mobileIndustriesOpen ? 'opened' : 'closed',
        'page_path': window.location.pathname
      });
    });
  }

  // Track mobile industry page clicks
  document.querySelectorAll('#mobile-industries a[href*="industries/"]').forEach(link => {
    link.addEventListener('click', function() {
      gtag('event', 'industry_link_click', {
        'industry': this.textContent.trim(),
        'source': 'mobile_menu',
        'page_path': window.location.pathname
      });
    });
  });

  // ========================================
  // 4. EXTERNAL LINK TRACKING
  // ========================================

  // Track clicks to external sites (LinkedIn, Clutch, GitHub, Calendly)
  document.querySelectorAll('a[target="_blank"], a[href^="https://calendly"], a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
    // Skip if already tracked above
    if (link.href.includes('calendly') && link.classList.contains('tracked')) return;

    link.addEventListener('click', function() {
      let linkType = 'external';
      if (this.href.includes('linkedin')) linkType = 'linkedin';
      else if (this.href.includes('clutch')) linkType = 'clutch';
      else if (this.href.includes('github')) linkType = 'github';
      else if (this.href.startsWith('tel:')) linkType = 'phone_call';
      else if (this.href.startsWith('mailto:')) linkType = 'email';

      gtag('event', 'external_link_click', {
        'link_type': linkType,
        'link_text': this.textContent.trim(),
        'link_url': this.href,
        'page_path': window.location.pathname
      });
    });
  });

  // ========================================
  // 5. SCROLL DEPTH TRACKING
  // ========================================

  let scrollTracked = { 25: false, 50: false, 75: false, 100: false };
  const pageLoadTime = performance.now();

  window.addEventListener('scroll', function() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;

    [25, 50, 75, 100].forEach(threshold => {
      if (scrollPercent >= threshold && !scrollTracked[threshold]) {
        const timeToScroll = Math.round(performance.now() - pageLoadTime);

        gtag('event', 'scroll_depth', {
          'scroll_percent': threshold,
          'page_title': document.title,
          'page_path': window.location.pathname,
          'time_to_scroll_ms': timeToScroll
        });

        scrollTracked[threshold] = true;
      }
    });
  }, { passive: true });

  // ========================================
  // 6. PAGE SECTION VISIBILITY TRACKING
  // ========================================

  // Track when user views specific sections (case studies, testimonials, people, etc.)
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id) {
        gtag('event', 'section_view', {
          'section_name': entry.target.id,
          'section_title': entry.target.querySelector('h2, h3')?.textContent.trim() || 'unknown',
          'page_path': window.location.pathname
        });
      }
    });
  }, { threshold: 0.3 });

  // Observe all major sections (have an ID)
  document.querySelectorAll('section[id], div[id][class*="section"]').forEach(section => {
    sectionObserver.observe(section);
  });

  // ========================================
  // 7. INTERNAL LINK CLICK TRACKING
  // ========================================

  // Track navigation to other pages
  document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach(link => {
    // Skip CTA buttons that are already tracked
    if (link.href.includes('calendly')) return;

    link.addEventListener('click', function() {
      gtag('event', 'internal_link_click', {
        'link_text': this.textContent.trim(),
        'link_url': this.href,
        'source_page': window.location.pathname,
        'target_page': this.pathname || this.href
      });
    });
  });

  // ========================================
  // 8. PAGE TYPE CUSTOM DIMENSION
  // ========================================

  // Set custom dimension for page type
  const pageType = window.location.pathname.includes('/industries/') ? 'industry_page' : 'root_page';
  gtag('event', 'page_view', {
    'page_type': pageType,
    'page_path': window.location.pathname,
    'page_title': document.title
  });

  // ========================================
  // 9. ERROR LOGGING
  // ========================================

  // Track form submission errors
  window.addEventListener('error', function(event) {
    if (event.message.includes('form') || event.message.includes('submit')) {
      gtag('event', 'error', {
        'error_message': event.message,
        'error_source': 'form_submission',
        'page_path': window.location.pathname
      });
    }
  });

} else {
  console.warn('Google Analytics (gtag) not loaded. Events will not be tracked.');
}
