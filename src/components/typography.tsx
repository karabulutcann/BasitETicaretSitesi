export function TH1({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h1 className={"scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl  "+className}>
     {children}
    </h1>
  );
}

export function TH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function TH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
     {children}
    </h3>
  );
}

export function TH4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}

export function TP({ children }: { children: React.ReactNode }) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6">
  {children}
    </p>
  );
}

export function TLead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xl text-muted-foreground">
   {children}
    </p>
  );
}

export function TLarge({ children }: { children: React.ReactNode }) {
  return <div className="text-lg font-semibold">  {children}</div>;
}

export function TSmall({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm font-medium leading-none">  {children}</small>
  );
}

export function TMuted({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground">  {children}</p>
  );
}

export function TPrice({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg font-semibold">  {children}</p>
  );
}