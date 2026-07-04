import { Users, UserPlus, Briefcase, IndianRupee } from "lucide-react";
import StatCard from "../../../components/dashboard/StatCard";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Admin Dashboard
                    </h1>

                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here's an overview of your business.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Clients"
                    value="0"
                    description="Registered clients"
                    icon={<Users className="h-6 w-6 text-primary" />}
                />

                <StatCard
                    title="Total Leads"
                    value="0"
                    description="New business leads"
                    icon={<UserPlus className="h-6 w-6 text-primary" />}
                />

                <StatCard
                    title="Active Projects"
                    value="0"
                    description="Projects in progress"
                    icon={<Briefcase className="h-6 w-6 text-primary" />}
                />

                <StatCard
                    title="Revenue"
                    value="₹0"
                    description="Total earnings"
                    icon={<IndianRupee className="h-6 w-6 text-primary" />}
                />

            </div>

        </div>
    );
}