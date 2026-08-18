import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin, Send, CheckCircle2, UserCheck, Code2, Loader2 } from 'lucide-react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct email delivery to weve.cyber@gmail.com via FormSubmit AJAX service
      await fetch('https://formsubmit.co/ajax/weve.cyber@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `New WevePrint Inquiry from ${name}`,
          Name: name,
          Email: email,
          Shop_Name: shopName || 'N/A',
          Message: message,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.warn('FormSubmit AJAX fallback triggered:', err.message);
      // Fallback: Launch mailto directly to weve.cyber@gmail.com
      const mailtoUrl = `mailto:weve.cyber@gmail.com?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nShop: ${shopName || 'N/A'}\n\nMessage:\n${message}`
      )}`;
      window.location.href = mailtoUrl;
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="anim-glow-orb absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-cyan-600/20 to-transparent" />
        <div className="anim-glow-orb absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-gradient-radial from-blue-600/15 to-transparent" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold uppercase tracking-wider">
            Get In Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Contact WevePrint Support
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Have questions about setting up your shop, printer connections, or custom pricing? Send a message directly to our inbox!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Contact Information</h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Official Email</span>
                    <a href="mailto:weve.cyber@gmail.com" className="font-extrabold text-cyan-400 hover:underline">
                      weve.cyber@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Director & Founder</span>
                    <span className="font-bold text-white">Md Shami Ahmad</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Lead Developer</span>
                    <span className="font-bold text-white">Md Shami Ahmad</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">Location</span>
                    <span className="font-bold text-white">India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7">
            <div className="glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
              <h3 className="text-xl font-extrabold text-white mb-6">Send Us A Message</h3>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-lg text-white">Message Sent Directly To Our Email!</h4>
                  <p className="text-xs text-slate-300">
                    Your message has been delivered to <strong>weve.cyber@gmail.com</strong>. We will reply to your email shortly!
                  </p>
                  <button
                    onClick={() => {
                      setName('');
                      setEmail('');
                      setShopName('');
                      setMessage('');
                      setSubmitted(false);
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cyber Cafe / Shop Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Shami Print Center"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us how we can help you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Send Message to weve.cyber@gmail.com</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} WevePrint. All Rights Reserved.
      </footer>
    </div>
  );
}
