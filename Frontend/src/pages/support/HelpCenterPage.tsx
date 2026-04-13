import PageLayout from '../../components/layout/PageLayout';

const HelpCenterPage = () => {
  const faqs = [
    {
      icon: 'person',
      title: 'Account & Login',
      desc: 'Trouble signing in? Reset your password from the login page, or contact support if your account is locked.',
    },
    {
      icon: 'event_upcoming',
      title: 'Sessions & Booking',
      desc: 'Book sessions from the Mentor Search page. Cancel anytime before the mentor confirms. Completed sessions appear in your history.',
    },
    {
      icon: 'payments',
      title: 'Payments & Refunds',
      desc: 'Payments are verified before sessions are confirmed. For refund requests, email support with your transaction details.',
    },
    {
      icon: 'bug_report',
      title: 'Report a Bug',
      desc: 'Found something broken? Email us with screenshots, your role (Learner/Mentor), and steps to reproduce the issue.',
    },
  ];

  return (
    <PageLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/3 -translate-x-1/3" />
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-bold tracking-wide uppercase mb-4">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              Support Center
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">How can we help?</h1>
            <p className="text-indigo-100 mt-2 max-w-lg text-sm leading-relaxed">
              Browse common questions below, or reach out to our support team directly.
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-indigo-200 bg-indigo-50 shadow-sm">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shrink-0">
            <span className="material-symbols-outlined text-2xl">mail</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Need direct help?</p>
            <p className="text-indigo-700 font-semibold text-sm truncate">support@skillsync.app</p>
          </div>
          <a
            href="mailto:support@skillsync.app"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            Email Us
          </a>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.title}
              className="group p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                  <span className="material-symbols-outlined text-xl">{faq.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{faq.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tip */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
          <span className="material-symbols-outlined text-amber-600 text-xl shrink-0">tips_and_updates</span>
          <p className="text-amber-800">
            <span className="font-bold">Tip:</span> Include your account email and role (Learner/Mentor/Admin) when contacting support for faster resolution.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default HelpCenterPage;
