// eslint-disable-next-line no-unused-vars
export const StatsCard = ({  icon: Icon, label, value, color = 'primary' }) => {
    const colorClasses = {
        primary: 'text-primary',
        green: 'text-green-600',
        purple: 'text-purple-600',
        red: 'text-red-600',
        yellow: 'text-yellow-600'
    };

    return (
        <div className={`${colorClasses[color]} rounded-2xl p-6 text-center 
                bg-gradient-to-br`}>
            <Icon size={32} className="mx-auto mb-2" />
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm font-medium uppercase tracking-wide">{label}</div>
        </div>
    );
};