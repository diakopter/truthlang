(module
  (type (func (param i32) (param i32) (result i32)))
  (func $addTwo (param i32) (param i32) (result i32)
    (get_local 0)
    (get_local 1)
    (i32.add)
  )
  (export "entryPoint" (func $addTwo))
)