export const cropAddress = (address?: string) => {
    if (address)
        return (
            <button onClick={() => { navigator.clipboard.writeText(address) }} className="group relative">
                {address.slice(0, 5)}...{address.slice(address.length - 5)}
                <p className="absolute top-0 left-0 right-0 group-hover:backdrop-brightness-75 text-sm py-0.5">
                    <span className="opacity-0 group-hover:opacity-100 text-gray-600 bg-colors-gray2 px-1 py-0.5">
                        Copy
                    </span>
                </p>
            </button>
        );
}