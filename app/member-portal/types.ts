export interface Member {
    id: number;
    first_name: string;
    last_name: string;
    member_id: string;
    phone_number?: string;
    email?: string;
    avail?: string;
    expiry_date: string;
    status: string;
    location: string;
    membership: string;
    monthly_fee: number;
    age: number;
    service?: string;
    gender: string;
    paid: boolean;
    image?: string;
    join_date: string;
}

export interface PaginatedResponse<T> {
    count: number,
    next: string | null,
    previous: string | null,
    current_page: number,
    total_page: number,
    results: T[];
    count_expired: number
    count_active: number
}