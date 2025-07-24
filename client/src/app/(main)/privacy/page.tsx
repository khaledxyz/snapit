import { siteConfig } from '@/config/site.config';
import { Shield, Eye, FileText, Lock, Database, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
    const lastUpdated = "July 24, 2025";

    return (
        <div className="container max-w-3xl py-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="text-primary" size={20} />
                </div>
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>

            <div className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
                <FileText size={14} />
                <span>Last updated: {lastUpdated}</span>
            </div>

            <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground">
                    At SnapIt, we value your privacy and are committed to protecting your personal information.
                    This Privacy Policy explains how we collect, use, and safeguard your data when you use our URL shortening service.
                </p>

                <div className="mt-8 space-y-12">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Database size={18} />
                            Information We Collect
                        </h2>
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">URL Data</h3>
                                    <p className="text-muted-foreground text-sm">
                                        When you use our service to shorten a URL, we store:
                                    </p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                                        <li>The original long URL you provide</li>
                                        <li>The shortened URL that our system generates</li>
                                        <li>Creation timestamp</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Usage Analytics</h3>
                                    <p className="text-muted-foreground text-sm">
                                        To improve our service and understand user behavior, we collect anonymous analytics data:
                                    </p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                                        <li>Page views and events</li>
                                        <li>Referrer information</li>
                                        <li>Anonymized IP address information (we truncate IP addresses)</li>
                                        <li>Browser type and device information</li>
                                        <li>Country-level location data</li>
                                    </ul>
                                    <div className="mt-3 text-xs flex items-center gap-1 bg-primary/10 text-primary p-2 rounded-md border border-primary/30">
                                        <Eye size={12} />
                                        <span>We use a privacy-focused analytics solution that does not use cookies for tracking visitors.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Lock size={18} />
                            How We Use Your Information
                        </h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                We use the collected information for the following purposes:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Service Functionality</h3>
                                    <p className="text-muted-foreground text-sm">
                                        To create and manage shortened URLs, redirect users, and maintain link functionality.
                                    </p>
                                </div>

                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Service Improvement</h3>
                                    <p className="text-muted-foreground text-sm">
                                        To analyze usage patterns and improve our service design, performance, and user experience.
                                    </p>
                                </div>

                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Link Analytics</h3>
                                    <p className="text-muted-foreground text-sm">
                                        To provide link creators with aggregated statistics about the performance of their links.
                                    </p>
                                </div>

                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Security & Abuse Prevention</h3>
                                    <p className="text-muted-foreground text-sm">
                                        To detect, prevent, and address technical issues, security threats, fraud, or other harmful activity.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Data Practices & Security</h2>
                        <div className="space-y-4">
                            <div className="bg-muted/30 border border-border rounded-lg p-6">
                                <h3 className="font-medium mb-3">Our Data Commitments</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <span className="font-medium">1</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">Minimalist Data Collection:</span> We only collect the information necessary to provide and improve our service.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <span className="font-medium">2</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">No Data Selling:</span> We never sell your personal information or URL data to third parties.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <span className="font-medium">3</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">Privacy by Design:</span> Our analytics implementation uses privacy-focused technology that doesn&apos;t use cookies and minimizes data collection.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <span className="font-medium">4</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">Data Security:</span> We implement appropriate security measures to protect your information from unauthorized access or disclosure.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Your Choices</h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                We respect your privacy choices and provide several ways to control your data:
                            </p>

                            <div className="bg-card border border-border rounded-lg overflow-hidden">
                                <div className="p-4 border-b border-border">
                                    <h3 className="font-medium">Analytics Opt-Out</h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        You can opt out of analytics tracking by enabling your browser&apos;s &quot;Do Not Track&quot; setting. We honor DNT signals.
                                    </p>
                                </div>

                                <div className="p-4 border-b border-border">
                                    <h3 className="font-medium">Delete Your Links</h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        If you create an account, you can delete any shortened URLs you&apos;ve created through your dashboard.
                                    </p>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-medium">Contact Us</h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        If you have any questions or concerns about your data, please contact us at privacy@snapit.io.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Changes to This Policy</h2>
                        <p className="text-muted-foreground">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our service after any modifications indicates your acceptance of the updated Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Open Source</h2>
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                            <h3 className="font-medium mb-2">Transparency Through Open Source</h3>
                            <p className="text-muted-foreground text-sm">
                                SnapIt is an open-source project. Our code is publicly available, which means you can inspect exactly how we handle your data. We believe in transparency and giving users control over their privacy.
                            </p>
                            <div className="mt-4">
                                <Link href={siteConfig.links.github} target='_blank' className="text-primary flex items-center gap-1 text-sm hover:underline">
                                    View our code on GitHub <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}