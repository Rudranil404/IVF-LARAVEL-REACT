export default function Footer() {
    return (
        <footer className="py-4 px-6 text-center md:text-left border-t border-slate-200 bg-white">
            <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} LifeCare IVF Technologies. All rights reserved. 
                <span className="hidden sm:inline"> | Secure Internal System</span>
            </p>
        </footer>
    );
}