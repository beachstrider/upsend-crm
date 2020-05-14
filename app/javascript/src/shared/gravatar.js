import gravatar from 'gravatar'

export default function g(email, opts={}){
  return gravatar.url(email, { 
    d: `https://avatars.dicebear.com/v2/avataaars/${encodeURIComponent(email)}.svg`,
    s: opts.s || '50px'
  })
}
