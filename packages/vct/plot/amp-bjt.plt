set term svg size 600, 400 dynamic
set output "amp-bjt.svg"
set title "BJT Amplifier"
set xlabel "Vbe / V"
set grid lw 1
set border lw 1
set format y "%g"
set format x "%g"
plot for [IDX=0:4] \
  'amp-bjt.data' \
  index IDX \
  using 1:2 \
  with lines lw 1 \
  title columnheader(1)
