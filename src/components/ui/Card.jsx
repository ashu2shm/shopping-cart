

function Card({ children, className = "", ...props }) {
  return (
    <div className={`border border-slate-400  rounded hover:border-slate-200 flex flex-col justify-center items-center 
      ${className} `} {...props}
    >
      {children}
    </div>
  )
}

export default Card
