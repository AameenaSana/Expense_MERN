// Category definitions shared by forms, lists, charts and budgets.
// `value` is what is stored in the database, so existing values are kept.

export const INCOME_CATEGORIES = [
    {value: 'salary', label: 'Salary', icon: 'money-bill-wave', color: '#059669'},
    {value: 'freelancing', label: 'Freelancing', icon: 'laptop-code', color: '#0891b2'},
    {value: 'investments', label: 'Investments', icon: 'chart-line', color: '#4f46e5'},
    {value: 'stocks', label: 'Stocks', icon: 'arrow-trend-up', color: '#7c3aed'},
    {value: 'bitcoin', label: 'Crypto', icon: 'bitcoin', brand: true, color: '#d97706'},
    {value: 'bank', label: 'Bank Transfer', icon: 'building-columns', color: '#2563eb'},
    {value: 'youtube', label: 'YouTube', icon: 'youtube', brand: true, color: '#dc2626'},
    {value: 'other', label: 'Other', icon: 'piggy-bank', color: '#6b7280'},
]

export const EXPENSE_CATEGORIES = [
    {value: 'rent', label: 'Rent & Housing', icon: 'house', color: '#4f46e5'},
    {value: 'groceries', label: 'Groceries', icon: 'basket-shopping', color: '#059669'},
    {value: 'utilities', label: 'Utilities', icon: 'bolt', color: '#d97706'},
    {value: 'transport', label: 'Transport', icon: 'car', color: '#0891b2'},
    {value: 'takeaways', label: 'Dining Out', icon: 'utensils', color: '#ea580c'},
    {value: 'health', label: 'Health', icon: 'briefcase-medical', color: '#dc2626'},
    {value: 'education', label: 'Education', icon: 'book-open', color: '#2563eb'},
    {value: 'subscriptions', label: 'Subscriptions', icon: 'tv', color: '#7c3aed'},
    {value: 'clothing', label: 'Clothing', icon: 'shirt', color: '#db2777'},
    {value: 'travelling', label: 'Travel', icon: 'plane', color: '#0d9488'},
    {value: 'other', label: 'Other', icon: 'circle-dot', color: '#6b7280'},
]

export const categoriesFor = (type) => (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)

// Look up a category, falling back gracefully for values not in the list
export const getCategory = (type, value) =>
    categoriesFor(type).find((c) => c.value === value) || {
        value,
        label: value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Uncategorised',
        icon: 'tag',
        color: '#9ca3af',
    }

export const CURRENCIES = [
    {code: 'USD', label: 'US Dollar'},
    {code: 'EUR', label: 'Euro'},
    {code: 'GBP', label: 'British Pound'},
    {code: 'INR', label: 'Indian Rupee'},
    {code: 'JPY', label: 'Japanese Yen'},
    {code: 'CAD', label: 'Canadian Dollar'},
    {code: 'AUD', label: 'Australian Dollar'},
    {code: 'SGD', label: 'Singapore Dollar'},
    {code: 'AED', label: 'UAE Dirham'},
]
